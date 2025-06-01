import { useState, useRef, useEffect } from "react";

import { MOCK_SESSION_LIST } from "../mocks/mocks";
import type { BubbleDataType, CopilotProps } from "../types/types";
import type { Conversation } from "@ant-design/x/es/conversations";
import type { GetProp, GetRef } from "antd";
import { Flex } from "antd";

import {
    Attachments,
    type AttachmentsProps,
    useXAgent,
    useXChat,
} from '@ant-design/x';

const AGENT_PLACEHOLDER = 'Generating content, please wait...';

export const useCopilotLogic = (props: CopilotProps) => {
    const { copilotOpen, setCopilotOpen } = props;
    const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);
    const abortController = useRef<AbortController>(null);

    const [messageHistory, setMessageHistory] = useState<Record<string, any>>({});
    const [sessionList, setSessionList] = useState<Conversation[]>(MOCK_SESSION_LIST);
    const [curSession, setCurSession] = useState(sessionList[0].key);
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [files, setFiles] = useState<GetProp<AttachmentsProps, 'items'>>([]);
    const [inputValue, setInputValue] = useState('');

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

        setInputValue('');
        setFiles([]);

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

    useEffect(() => {
        if (messages?.length) {
            setMessageHistory((prev) => ({
                ...prev,
                [curSession]: messages,
            }));
        }
    }, [messages]);

    return {
        state: {
            copilotOpen,
            messageHistory,
            sessionList,
            curSession,
            attachmentsOpen,
            files,
            inputValue,
            loading,
            messages,
            attachmentsRef,
        },
        actions: {
            setCopilotOpen,
            setSessionList,
            setCurSession,
            setAttachmentsOpen,
            setFiles,
            setInputValue,
            onRequest,
            setMessages,
            handleUserSubmit,
            onPasteFile,
        },
        constants: {
            AGENT_PLACEHOLDER,
        },
    };
};