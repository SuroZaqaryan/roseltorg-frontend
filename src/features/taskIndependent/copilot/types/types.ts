import type { UploadFile } from "antd";
import type { Ref } from "react";
// import type { Conversation, Message } from "@ant-design/x";
import type {Conversation} from "@ant-design/x/es/conversations";

interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
  files: File[];
}

export interface ChatHeaderProps {
    styles: any;
    sessionList: Conversation[];
    curSession: string;
    messages: Message[];
    setSessionList: (list: Conversation[]) => void;
    setCurSession: (session: string) => void;
    setMessages: (messages: Message[]) => void;
    setCopilotOpen: (open: boolean) => void;
    messageHistory: Record<string, Message[]>;
}

export interface ChatListProps {
    styles: any;
    messages: Message[];
    AGENT_PLACEHOLDER: string;
    handleUserSubmit: (text: string) => void;
}

export interface SendHeaderProps {
    attachmentsOpen: boolean;
    setAttachmentsOpen: (open: boolean) => void;
    files: UploadFile[];
    setFiles: (files: UploadFile[]) => void;
    attachmentsRef: Ref<any>;
}

export interface ChatSenderProps extends SendHeaderProps {
    styles: any;
    loading: boolean;
    inputValue: string;
    setInputValue: (value: string) => void;
    handleUserSubmit: (text: string) => void;
    onPasteFile: (e: ClipboardEvent) => void;
}