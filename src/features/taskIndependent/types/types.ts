export type BubbleDataType = {
    content: string;
    role: string;
    files?: any[];
};

export interface SidebarChatProps {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}