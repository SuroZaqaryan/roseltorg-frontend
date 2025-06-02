export type BubbleDataType = {
    content: string;
    role: string;
    files?: any[];
};

export interface CopilotProps {
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
}

export interface MessageHistory {
  [key: string]: any[];
}