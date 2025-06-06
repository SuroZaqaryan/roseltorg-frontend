import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MOCK_SESSION_LIST } from "../mocks/mocks.tsx";
import type { BubbleDataType, CopilotProps } from "../../types/types.ts";
import type { Conversation } from "@ant-design/x/es/conversations";
import type { GetProp, GetRef } from "antd";
import { Flex } from "antd";
import { useChatStore } from "../../../../shared/stores/useChatStore.ts";

import {
    Attachments,
    type AttachmentsProps,
    useXAgent,
    useXChat,
} from '@ant-design/x';

const AGENT_PLACEHOLDER = 'Generating content, please wait...';

export const useSidebarChat = (props: CopilotProps) => {
    const { openSidebar, setOpenSidebar } = props;
    const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);
    const abortController = useRef<AbortController>(null);

    const [messageHistory, setMessageHistory] = useState<Record<string, any>>({});
    const [sessionList, setSessionList] = useState<Conversation[]>(MOCK_SESSION_LIST);
    const [curSession, setCurSession] = useState(sessionList[0].key);
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [files, setFiles] = useState<GetProp<AttachmentsProps, 'items'>>([]);
    const [inputValue, setInputValue] = useState('');

    console.log('messageHistory', messageHistory)

    const { setUploadedFile } = useChatStore();

    const [agent] = useXAgent<BubbleDataType>({
        request: async ({ message, model, signal }, { onSuccess }) => {
            const file = message?.files?.[0];

            const formData = new FormData();

            if (file) {
                formData.append('file', file.originFileObj || file);
            }

            formData.append('message', message?.content || '');
            formData.append('model', model);

            try {
                const res = await axios.post(
                    'http://localhost:8080/api/conversation',
                    formData,
                    {
                        headers: {
                            Authorization: 'Bearer sk-xxxxxxxxxxxxxxxxxxxx',
                        },
                        signal,
                    }
                );

                const data = res.data;

                setUploadedFile(data.files[0]);
                onSuccess?.([{ ...(data || {}), role: 'assistant' }]);
            } catch (error) {
                if (axios.isCancel?.(error)) {
                    console.warn('Request canceled', error.message);
                } else {
                    console.error('Request failed:', error);
                }
            }
        },
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
        resolveAbortController: (controller) => {
            abortController.current = controller;
        },
    });

    const handleUserSubmit = (val: string) => {
        onRequest({
            stream: false,
            message: {
                content: val,
                role: 'user',
                files,
                messageRender: () => (
                    <Flex vertical gap={6}>
                        {val}
                        {
                            files && files.length > 0 && (
                                <Flex vertical gap="middle">
                                    {(files as any[]).map((item) => (
                                        <Attachments.FileCard
                                            key={item.uid}
                                            item={item}
                                            style={{ borderRadius: 18, border: '1px solid #dbdbdb' }}
                                        />
                                    ))}
                                </Flex>
                            )
                        }
                    </Flex>
                ),
            },
        });

        setInputValue('');
        setFiles([]);

        if (sessionList.find((i) => i.key === curSession)?.label === 'Новая сессия') {
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
            openSidebar,
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
            setOpenSidebar,
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