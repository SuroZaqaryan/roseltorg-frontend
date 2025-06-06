import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as mammoth from "mammoth";
import { useChatStore } from "@stores/useChatStore.ts";

import type { FileRow } from "@features/chat/types/types";

export const useFilePreview = () => {
    const { uploadedFile } = useChatStore();
    const [filePreview, setFilePreview] = useState<FileRow[] | null>(null);
    const [loadingTable, setLoadingTable] = useState(false);

    useEffect(() => {
        if (!uploadedFile || typeof uploadedFile !== "object" || !uploadedFile.url) {
            setFilePreview(null);
            return;
        }

        const fetchFile = async () => {
            try {
                setLoadingTable(true);
                const res = await fetch(uploadedFile.url);
                const blob = await res.blob();
                const extension = uploadedFile.name?.split(".").pop()?.toLowerCase();

                if (extension === "xlsx" || extension === "xls") {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const workbook = XLSX.read(e.target?.result, { type: "binary" });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const data = XLSX.utils.sheet_to_json(sheet, { defval: null });
                        setFilePreview(data as FileRow[]);
                    };
                    reader.readAsBinaryString(blob);
                } else if (extension === "docx") {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const arrayBuffer = e.target?.result as ArrayBuffer;
                        const result = await mammoth.convertToHtml({ arrayBuffer });
                        const html = result.value;

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, "text/html");
                        const table = doc.querySelector("table");
                        if (!table) {
                            setFilePreview([]);
                            return;
                        }

                        const rows = Array.from(table.querySelectorAll("tr"));
                        const headers = Array.from(rows[0].querySelectorAll("th, td")).map((cell) => cell.textContent?.trim() || "");

                        const bodyRows = rows.slice(1);
                        const data = bodyRows.map((row) => {
                            const cells = Array.from(row.querySelectorAll("td")).map((td) => td.textContent?.trim() || "");
                            return headers.reduce((obj, header, i) => {
                                obj[header] = cells[i] || null;
                                return obj;
                            }, {} as FileRow);
                        });

                        setFilePreview(data);
                    };
                    reader.readAsArrayBuffer(blob);
                } else {
                    console.warn("Неподдерживаемый формат файла");
                    setFilePreview([]);
                }
            } catch (e) {
                console.error("Ошибка при загрузке файла", e);
            } finally {
                setLoadingTable(false);
            }
        };

        fetchFile();
    }, [uploadedFile]);

    return { filePreview, loadingTable };
};
