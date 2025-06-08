import { useEffect, useState } from "react";
import { useChatStore } from "@stores/useChatStore.ts";
import { parseXlsxFile, parseDocxFile } from "@shared/lib/fileParsers.ts";
import { getFileExtension } from "@shared/lib/utils/getFileExtension.ts";
import pdfWorker from "pdfjs-dist/build/pdf.worker?worker";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfWorker();

export const useFilePreview = () => {
  const { uploadedFile } = useChatStore();
  const [officeContent, setOfficeContent] = useState<string | null>(null);
  const [contentPdf, setContentPdf] = useState<Blob>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uploadedFile?.url) {
      setOfficeContent(null);
      return;
    }

    const fetchFile = async () => {
      try {
        setLoading(true);
        const res = await fetch(uploadedFile.url);
        if (!res.ok) throw new Error(`Ошибка загрузки файла: ${res.status}`);
        const blob = await res.blob();
        const ext = getFileExtension(uploadedFile.name);

        if (ext === "xlsx" || ext === "xls") {
          setOfficeContent(await parseXlsxFile(blob));
        } else if (ext === "docx") {
          setOfficeContent(await parseDocxFile(blob));
        } else if (ext === "pdf") {
          setContentPdf(blob);
        } else {
          setOfficeContent("Неподдерживаемый формат файла.");
        }
      } catch (err) {
        console.error("Ошибка при чтении файла:", err);
        setOfficeContent("Произошла ошибка при чтении файла.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [uploadedFile]);

  return { officeContent, contentPdf, loading };
};
