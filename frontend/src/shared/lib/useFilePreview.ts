import { useEffect, useState } from "react";
import { http } from '@shared/api/http'
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
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!uploadedFile?.url) {
      setOfficeContent(null);
      return;
    }

    const fetchFile = async () => {
      try {
        setLoading(true);
        const res = await http.get(uploadedFile.url, { responseType: "blob" });
        const blob = res.data;
        const ext = getFileExtension(uploadedFile.name);

        if (ext === "xlsx" || ext === "xls") {
          setError(null);
          setOfficeContent(await parseXlsxFile(blob));
        }
        else if (ext === "docx") {
          setError(null);
          setOfficeContent(await parseDocxFile(blob));
        }
        else if (ext === "pdf") {
          setError(null);
          setContentPdf(blob);
        }
        else {
          setError("Пожалуйста, выберите один из поддерживаемых форматов: XLSX, DOCX, PDF.");
        }
      } catch (err) {
        setError("Произошла ошибка при чтении файла.");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [uploadedFile]);

  return { officeContent, contentPdf, loading, error };
};
