import { useEffect, useState } from "react";
import { useChatStore } from "@stores/useChatStore";
import { parseXlsxFile, parseDocxFile, parsePdfFile } from "./fileParsers";
// @ts-ignore
import pdfWorker from "pdfjs-dist/build/pdf.worker?worker";
import * as pdfjsLib from "pdfjs-dist";

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
        const res = await fetch(uploadedFile.url);
        if (!res.ok) throw new Error(`Ошибка загрузки файла: ${res.status}`);
        const blob = await res.blob();
        const ext = uploadedFile.name?.split(".").pop()?.toLowerCase();

        if (ext === "xlsx" || ext === "xls") {
          setContent(await parseXlsxFile(blob));
        } else if (ext === "docx") {
          setContent(await parseDocxFile(blob));
        } else if (ext === "pdf") {
          setContent(await parsePdfFile(blob));
        } else {
          setContent("Неподдерживаемый формат файла.");
        }
      } catch (err) {
        console.error("Ошибка при чтении файла:", err);
        setContent("Произошла ошибка при чтении файла.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [uploadedFile]);

  return { content, loading };
};
