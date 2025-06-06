export type BubbleDataType = {
    content: string;
    role: string;
    files?: any[];
};

export interface CopilotProps {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}