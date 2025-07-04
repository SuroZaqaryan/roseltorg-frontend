import { useRef } from "react";
import dayjs from "dayjs";

import { message, Button, Popover, Space, Spin, Typography, theme } from "antd";
import {
    CloseOutlined,
    CloudUploadOutlined,
    CommentOutlined,
    CopyOutlined,
    PaperClipOutlined,
    PlusOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { Attachments, Bubble, Conversations, Prompts, Sender, Suggestion } from "@ant-design/x";

import type { SidebarChatProps } from "../types/types";

import { MOCK_QUESTIONS, MOCK_SUGGESTIONS } from "./mocks/mocks";
import { useSidebarChat } from "./model/useSidebarChat.tsx";
import { useChatSidebarStyle } from "./styles/useChatSidebarStyle.ts";


const { useToken } = theme;
const { Text } = Typography;

export const ChatSidebar = (props: SidebarChatProps) => {
    const { token } = useToken();
    const { styles } = useChatSidebarStyle();

    const abortController = useRef<AbortController>(null);

    const {
        state: {
            openSidebar,
            sessionList,
            curSession,
            attachmentsOpen,
            messageHistory,
            files,
            inputValue,
            loading,
            messages,
            attachmentsRef,
        },
        actions: {
            setOpenSidebar,
            setSessionList,
            setCurSession,
            setAttachmentsOpen,
            setFiles,
            setInputValue,
            handleUserSubmit,
            onPasteFile,
            setMessages,
        },
        constants: { AGENT_PLACEHOLDER },
    } = useSidebarChat(props);

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
                            setTimeout(() => {
                                setSessionList([
                                    { key: timeNow, label: 'Новая сессия', group: 'Сегодня' },
                                    ...sessionList,
                                ]);
                                setCurSession(timeNow);
                                setMessages([]);
                            }, 100);
                        } else {
                            // message.error('Вы уже находитесь в новом чате');
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
                    onClick={() => setOpenSidebar(false)}
                    className={styles.headerButton}
                />
            </Space>
        </div>
    );

    const chatList = (
        <div className={styles.chatList}>
            {messages?.length ? (
                <Bubble.List
                    style={{ height: '100%', paddingInline: 16 }}
                    items={messages?.map((i) => ({
                        ...i.message,
                        classNames: {
                            content:
                                (i.message.role === 'assistant' ? styles.assistantContent : styles.userContent) +
                                (i.status === 'loading' ? ` ${styles.loadingMessage}` : ''),
                        },
                        typing: i.status === 'loading' ? { step: 5, interval: 20, suffix: <>💗</> } : false,
                        avatar: i.message.role === 'assistant' ? { src: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp' } : undefined,
                    }))}
                    roles={{
                        assistant: {
                            placement: 'start',
                            header: (
                                <Text style={{ fontWeight: '500' }}>Roseltorg</Text>
                            ),
                            footer: (messageProps) => (
                                <div style={{ display: 'flex', position: 'relative', top: '-5px' }}>
                                    <Button type="text" size="small" icon={<ReloadOutlined />} />
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<CopyOutlined />}
                                        onClick={() => {
                                            if (messageProps) {
                                                navigator.clipboard.writeText(messageProps)
                                                    .then(() => {
                                                        message.success('Текст скопирован в буфер обмена');
                                                    })
                                                    .catch(() => {
                                                        message.error('Не удалось скопировать текст');
                                                    });
                                            }
                                        }}
                                    />
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
                            placement: 'end',
                        },
                    }}
                />
            ) : (
                <>
                    <Prompts
                        vertical
                        title="С чем Roseltorg может помочь: "
                        items={MOCK_QUESTIONS.map((i) => ({ key: i, description: i }))}
                        onItemClick={(info) => handleUserSubmit(info?.data?.description as string)}
                        style={{ marginInline: 16 }}
                        styles={{
                            title: { fontSize: 14 },
                            item: { background: token.colorPrimary, color: '#fff', borderRadius: 36 },
                        }}
                    />
                </>
            )}
        </div>
    );

    const sendHeader = (
        <Sender.Header
            title="XLSX, DOCX, PDF"
            styles={{ content: { padding: 0 } }}
            open={attachmentsOpen}
            onOpenChange={setAttachmentsOpen}
            forceRender
        >
            <Attachments
                ref={attachmentsRef}
                beforeUpload={(_, fileList) => {
                    if (files.length >= 1 || fileList.length > 1) {
                        return false;
                    }
                    return false; 
                }}
                items={files}
                onChange={({ fileList }) => {
                    if (fileList.length > 1) {
                        return;
                    }

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
                        ? { title: 'Перетащите файл сюда' }
                        : {
                            icon: <CloudUploadOutlined />,
                            title: 'Загрузить файлы',
                            description: 'Нажмите или перетащите файл в эту область для загрузки',
                        }
                }
            />
        </Sender.Header>
    );

    const chatSender = (
        <div className={styles.chatSend}>
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
                                    {loading ? <LoadingButton type="default" /> : <SendButton className={styles.sendButton} />}
                                </div>
                            );
                        }}
                    />
                )}
            </Suggestion>
        </div>
    );

    return (
        <div
            className={styles.chat}
            style={{
                width: openSidebar ? 400 : 0,
                display: openSidebar ? 'flex' : 'none',
            }}
        >
            {chatHeader}
            {chatList}
            {chatSender}
        </div>

    );
};

export default ChatSidebar;