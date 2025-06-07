import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import * as mammoth from "mammoth";
import { useChatStore } from "@stores/useChatStore.ts";
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker?worker';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

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
                const fileUrl = uploadedFile.url;
                const res = await fetch(fileUrl);
                if (!res.ok) throw new Error(`Ошибка загрузки файла: ${res.status}`);

                const blob = await res.blob();
                const extension = uploadedFile.name?.split(".").pop()?.toLowerCase();

                if (extension === "xlsx" || extension === "xls") {
                    const csvToTable = (csv: string) => {
                        const rows = csv.trim().split("\n").map(row => row.split(","));
                        return `
                          <table>
                            <thead>
                              <tr>${rows[0].map(cell => `<th>${cell}</th>`).join('')}</tr>
                            </thead>
                            <tbody>
                              ${rows.slice(1).map(row =>
                                `<tr>${row.map(cell =>
                                  `<td>${cell}</td>`).join('')}</tr>`).join('')}
                            </tbody>
                          </table>`;
                    };

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const workbook = XLSX.read(e.target?.result, { type: "binary" });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const rawData = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
                        setContent(csvToTable(rawData));
                    };
                    reader.readAsBinaryString(blob);
                }

                else if (extension === "docx") {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const arrayBuffer = e.target?.result as ArrayBuffer;
                        const result = await mammoth.convertToHtml({ arrayBuffer });

                        // Парс HTML
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(result.value, "text/html");

                        setContent(doc.body.innerHTML);
                    };
                    reader.readAsArrayBuffer(blob);
                }

                else if (extension === "pdf") {
                    const arrayBuffer = await blob.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

                    const pages: string[] = [];
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const textItems = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
                        pages.push(textItems);
                    }

                    setContent(pages.join("\n\n"));
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
