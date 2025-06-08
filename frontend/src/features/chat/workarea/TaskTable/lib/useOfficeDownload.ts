import { useCallback } from "react";

export const useOfficeDownload = () => {
  const download = useCallback((fileName: string, content: string, mimeType = "text/html") => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, []);

  return { download };
};
