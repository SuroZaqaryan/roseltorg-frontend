import type {BubbleDataType, CopilotProps} from "../types/types.ts";
import {useCopilotStyle} from "../styles/useCopilotStyle.ts";
import {useEffect, useRef, useState} from "react";
import {Button, Flex, type GetProp, type GetRef, message, Popover, Space, Spin, Typography} from "antd";
import {
    Attachments,
    type AttachmentsProps,
    Bubble,
    Conversations,
    Prompts,
    Sender, Suggestion,
    useXAgent,
    useXChat
} from "@ant-design/x";
import type {Conversation} from "@ant-design/x/es/conversations";
import {MOCK_QUESTIONS, MOCK_SESSION_LIST, MOCK_SUGGESTIONS} from "../mocks/mocks.tsx";
import {
    CloseOutlined,
    CloudUploadOutlined,
    CommentOutlined,
    CopyOutlined, PaperClipOutlined,
    PlusOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const AGENT_PLACEHOLDER = 'Generating content, please wait...';
const { Text } = Typography;

const Copilot = (props: CopilotProps) => {
    const { copilotOpen, setCopilotOpen } = props;
    const { styles } = useCopilotStyle();
    const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);
    const abortController = useRef<AbortController>(null);

    // ==================== State ====================

    const [messageHistory, setMessageHistory] = useState<Record<string, any>>({});

    const [sessionList, setSessionList] = useState<Conversation[]>(MOCK_SESSION_LIST);
    const [curSession, setCurSession] = useState(sessionList[0].key);

    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [files, setFiles] = useState<GetProp<AttachmentsProps, 'items'>>([]);

    const [inputValue, setInputValue] = useState('');

    /**
     * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
     */

        // ==================== Runtime ====================

    const [agent] = useXAgent<BubbleDataType>({
            baseURL: 'https://api.x.ant.design/api/llm_siliconflow_deepseekr1',
            model: 'deepseek-ai/DeepSeek-R1',
            dangerouslyApiKey: 'Bearer sk-xxxxxxxxxxxxxxxxxxxx',
        });

    const loading = agent.isRequesting();

    const { messages, onRequest, setMessages } = useXChat({
        agent,
        requestFallback: (_, { error }) => {
            if (error.name === 'AbortError') {
                return {
                    content: 'Request is aborted',
                    role: 'assistant',
                };
            }
            return {
                content: 'Request failed, please try again!',
                role: 'assistant',
            };
        },
        transformMessage: (info) => {
            const { originMessage, chunk } = info || {};
            let currentContent = '';
            let currentThink = '';
            try {
                if (chunk?.data && !chunk?.data.includes('DONE')) {
                    const message = JSON.parse(chunk?.data);
                    currentThink = message?.choices?.[0]?.delta?.reasoning_content || '';
                    currentContent = message?.choices?.[0]?.delta?.content || '';
                }
            } catch (error) {
                console.error(error);
            }

            let content = '';

            if (!originMessage?.content && currentThink) {
                content = `<think>${currentThink}`;
            } else if (
                originMessage?.content?.includes('<think>') &&
                !originMessage?.content.includes('</think>') &&
                currentContent
            ) {
                content = `${originMessage?.content}</think>${currentContent}`;
            } else {
                content = `${originMessage?.content || ''}${currentThink}${currentContent}`;
            }

            return {
                content: content,
                role: 'assistant',
            };
        },
        resolveAbortController: (controller) => {
            abortController.current = controller;
        },
    });

    // ==================== Event ====================
    const handleUserSubmit = (val: string) => {
        onRequest({
            stream: true,
            message: {
                content: val,
                role: 'user',
                files,
                messageRender: () => (
                    <div>
                        {val}
                        {
                            files && files.length > 0 && (
                                <Flex vertical gap="middle">
                                    {(files as any[]).map((item) => (
                                        <Attachments.FileCard key={item.uid} item={item} />
                                    ))}
                                </Flex>
                            )
                        }
                    </div>
                ),
            },
        });


        // очищаем поле ввода и файлы
        setInputValue('');
        setFiles([]);

        // обновление названия сессии (mock)
        if (sessionList.find((i) => i.key === curSession)?.label === 'New session') {
            setSessionList(
                sessionList.map((i) => (i.key !== curSession ? i : { ...i, label: val?.slice(0, 20) })),
            );
        }
    };


    const onPasteFile = (_: File, files: FileList) => {
        for (const file of files) {
            attachmentsRef.current?.upload(file);
        }
        setAttachmentsOpen(true);
    };

    // ==================== Nodes ====================
    const chatHeader = (
        <div className={styles.chatHeader}>
            <div className={styles.headerTitle}>✨ Чат-бот помощник</div>
            <Space size={0}>
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        if (messages?.length) {
                            const timeNow = dayjs().valueOf().toString();
                            abortController.current?.abort();
                            // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
                            // In future versions, the sessionId capability will be added to resolve this problem.
                            setTimeout(() => {
                                setSessionList([
                                    { key: timeNow, label: 'New session', group: 'Today' },
                                    ...sessionList,
                                ]);
                                setCurSession(timeNow);
                                setMessages([]);
                            }, 100);
                        } else {
                            message.error('Вы уже находитесь в новом чате');
                        }
                    }}
                    className={styles.headerButton}
                />
                <Popover
                    placement="bottom"
                    styles={{ body: { padding: 0, maxHeight: 600 } }}
                    content={
                        <Conversations
                            items={sessionList?.map((i) =>
                                i.key === curSession ? { ...i, label: `[current] ${i.label}` } : i,
                            )}
                            activeKey={curSession}
                            groupable
                            onActiveChange={async (val) => {
                                abortController.current?.abort();
                                // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
                                // In future versions, the sessionId capability will be added to resolve this problem.
                                setTimeout(() => {
                                    setCurSession(val);
                                    setMessages(messageHistory?.[val] || []);
                                }, 100);
                            }}
                            styles={{ item: { padding: '0 8px' } }}
                            className={styles.conversations}
                        />
                    }
                >
                    <Button type="text" icon={<CommentOutlined />} className={styles.headerButton} />
                </Popover>
                <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => setCopilotOpen(false)}
                    className={styles.headerButton}
                />
            </Space>
        </div>
    );

    const chatList = (
        <div className={styles.chatList}>
            {messages?.length ? (
                /** 消息列表 */
                <Bubble.List
                    style={{ height: '100%', maxHeight: '750px', paddingInline: 16 }}
                    items={messages?.map((i) => ({
                        ...i.message,
                        classNames: {
                            content: i.status === 'loading' ? styles.loadingMessage : '',
                        },
                        typing: i.status === 'loading' ? { step: 5, interval: 20, suffix: <>💗</> } : false,
                        avatar: i.message.role === 'assistant' ? { src: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp'} : undefined,
                        // i.message.role === 'user'
                        //     ? { icon: <UserOutlined />,  }
                        //     : { src: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp'},
                    }))}
                    roles={{
                        assistant: {
                            placement: 'start',
                            header: (
                                <Text style={{fontWeight: '500'}}>OMI</Text>
                            ),

                            footer: (
                                <div style={{ display: 'flex' }}>
                                    <Button type="text" size="small" icon={<ReloadOutlined />} />
                                    <Button type="text" size="small" icon={<CopyOutlined />} />
                                </div>
                            ),
                            loadingRender: () => (
                                <Space>
                                    <Spin size="small" />
                                    {AGENT_PLACEHOLDER}
                                </Space>
                            ),
                        },
                        user: {
                            placement: 'end' ,
                            // header: (
                            //     <Text style={{fontWeight: '500'}}>Вы</Text>
                            // ),
                        },
                    }}
                />
            ) : (
                /** 没有消息时的 welcome */
                <>
                    <Prompts
                        vertical
                        title="Я могу помочь вам с: "
                        items={MOCK_QUESTIONS.map((i) => ({ key: i, description: i }))}
                        onItemClick={(info) => handleUserSubmit(info?.data?.description as string)}
                        style={{
                            marginInline: 16,
                        }}
                        styles={{
                            title: { fontSize: 14 },
                            item: { background: '#8680b7', color: '#fff', borderRadius: 36 },
                        }}
                    />
                </>
            )}
        </div>
    );
    const sendHeader = (
        <Sender.Header
            title="Upload File"
            styles={{ content: { padding: 0 } }}
            open={attachmentsOpen}
            onOpenChange={setAttachmentsOpen}
            forceRender
        >
            <Attachments
                ref={attachmentsRef}
                beforeUpload={() => false}
                items={files}
                onChange={({ fileList }) => {
                    const updated = fileList.map((file) => {
                        if (!file.url && file.originFileObj) {
                            return {
                                ...file,
                                url: URL.createObjectURL(file.originFileObj),
                            };
                        }
                        return file;
                    });
                    setFiles(updated);
                }}

                placeholder={(type) =>
                    type === 'drop'
                        ? { title: 'Drop file here' }
                        : {
                            icon: <CloudUploadOutlined />,
                            title: 'Upload files',
                            description: 'Click or drag files to this area to upload',
                        }
                }
            />
        </Sender.Header>
    );
    const chatSender = (
        <div className={styles.chatSend}>
            {/** 输入框 */}
            <Suggestion block items={MOCK_SUGGESTIONS} onSelect={(itemVal) => setInputValue(`[${itemVal}]:`)}>
                {({ onTrigger, onKeyDown }) => (
                    <Sender
                        loading={loading}
                        value={inputValue}

                        onChange={(v) => {
                            onTrigger(v === '/');
                            setInputValue(v);
                        }}
                        onSubmit={() => {
                            handleUserSubmit(inputValue);
                            setInputValue('');
                            setAttachmentsOpen(false);
                        }}
                        onCancel={() => {
                            abortController.current?.abort();
                        }}
                        allowSpeech
                        placeholder="Ведите сообщение..."
                        onKeyDown={onKeyDown}
                        header={sendHeader}
                        prefix={
                            <Button
                                type="text"
                                icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                                onClick={() => setAttachmentsOpen(!attachmentsOpen)}
                            />
                        }
                        onPasteFile={onPasteFile}
                        actions={(_, info) => {
                            const { SendButton, LoadingButton, SpeechButton } = info.components;
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <SpeechButton className={styles.speechButton} />
                                    {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
                                </div>
                            );
                        }}
                    />
                )}
            </Suggestion>
        </div>
    );

    useEffect(() => {
        // history mock
        if (messages?.length) {
            setMessageHistory((prev) => ({
                ...prev,
                [curSession]: messages,
            }));
        }
    }, [messages]);

    return (
        <div className={styles.copilotChat} style={{ width: copilotOpen ? 400 : 0 }}>
            {/** 对话区 - header */}
            {chatHeader}

            {/** 对话区 - 消息列表 */}
            {chatList}

            {/** 对话区 - 输入框 */}
            {chatSender}
        </div>
    );
};

export default Copilot;