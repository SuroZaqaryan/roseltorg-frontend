export type BubbleDataType = {
    content: string;
    role: string;
    files?: any[];
};

export interface SidebarChatProps {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}

export type CellValue = string | number | boolean | null | undefined;
export type FileRow = Record<string, CellValue>;