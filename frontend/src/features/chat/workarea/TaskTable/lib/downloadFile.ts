import * as XLSX from "xlsx";
import { message } from "antd";
import type { FileRow } from "@features/chat/types/types";
import type { TaskUploadedFile } from "@stores/useChatStore";

export const downloadFile = (
  uploadedFile: TaskUploadedFile | null,
  dataSource: FileRow[]
) => {
  if (!uploadedFile) return;

  const extension = uploadedFile.name?.split(".").pop()?.toLowerCase();

  if (extension === "xlsx" || extension === "xls") {
    if (!dataSource.length) return;

    const cleanData = dataSource.map(({ key, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const fileName = uploadedFile.name.replace(/\.[^/.]+$/, "");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  else if (extension === "docx") {
    fetch(uploadedFile.url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = uploadedFile.name || "file.docx";
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        console.error("Ошибка при скачивании docx:", err);
        message.error("Не удалось скачать файл");
      });
  }

  else {
    message.warning("Неподдерживаемый формат для скачивания");
  }
};
