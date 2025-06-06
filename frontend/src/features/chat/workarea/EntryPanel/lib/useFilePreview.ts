import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as mammoth from "mammoth";
import { useChatStore } from "@stores/useChatStore.ts";

export const useFilePreview = () => {
    const { uploadedFile } = useChatStore();
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!uploadedFile?.url) {
            setContent(null);
            return;
        }

        const fetchFile = async () => {
            try {
                setLoading(true);

                // Кодируем URL (если вдруг сервер отдаёт неэкранированное имя)
                const fileUrl = uploadedFile.url;

                const res = await fetch(fileUrl);
                if (!res.ok) throw new Error(`Ошибка загрузки файла: ${res.status}`);

                const blob = await res.blob();
                const extension = uploadedFile.name?.split(".").pop()?.toLowerCase();

                if (extension === "xlsx" || extension === "xls") {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const workbook = XLSX.read(e.target?.result, { type: "binary" });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const rawData = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
                        setContent(rawData);
                    };
                    reader.readAsBinaryString(blob);
                }
                else if (extension === "docx") {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const arrayBuffer = e.target?.result as ArrayBuffer;
                        const result = await mammoth.convertToHtml({ arrayBuffer });
                        setContent(result.value);
                    };
                    reader.readAsArrayBuffer(blob);
                }

                else {
                    setContent("Неподдерживаемый формат файла.");
                }
            } catch (error) {
                console.error("Ошибка при чтении файла:", error);
                setContent("Произошла ошибка при чтении файла.");
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
    }, [uploadedFile]);

    return { content, loading };
};
