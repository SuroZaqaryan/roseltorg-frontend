import * as XLSX from "xlsx";
import * as mammoth from "mammoth";
import * as pdfjsLib from 'pdfjs-dist';

type ParsedResult = Promise<string>;

export const parseXlsxFile = async (blob: Blob): ParsedResult => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const workbook = XLSX.read(reader.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const merges = sheet["!merges"] || [];
      const range = XLSX.utils.decode_range(sheet["!ref"]!);
      const table: string[][] = [];

      for (let row = range.s.r; row <= range.e.r; row++) {
        table[row] = [];
        for (let col = range.s.c; col <= range.e.c; col++) {
          table[row][col] = "";
        }
      }

      Object.keys(sheet).forEach((key) => {
        if (key.startsWith("!")) return;
        const cell = sheet[key];
        const { r, c } = XLSX.utils.decode_cell(key);
        table[r][c] = String(cell.v ?? "");
      });

      const mergedMap = new Map();
      for (const merge of merges) {
        mergedMap.set(`${merge.s.r}-${merge.s.c}`, merge);
      }

      let html = `<table border="1">`;
      for (let row = 0; row < table.length; row++) {
        html += "<tr>";
        for (let col = 0; col < table[row].length; col++) {
          const merge = mergedMap.get(`${row}-${col}`);
          if (merge) {
            const rowspan = merge.e.r - merge.s.r + 1;
            const colspan = merge.e.c - merge.s.c + 1;
            html += `<td rowspan="${rowspan}" colspan="${colspan}">${table[row][col]}</td>`;
            for (let r = merge.s.r; r <= merge.e.r; r++) {
              for (let c = merge.s.c; c <= merge.e.c; c++) {
                if (r === row && c === col) continue;
                table[r][c] = null!;
              }
            }
          } else if (table[row][col] !== null) {
            html += `<td>${table[row][col]}</td>`;
          }
        }
        html += "</tr>";
      }
      html += "</table>";
      resolve(html);
    };
    reader.readAsBinaryString(blob);
  });
};

export const parseDocxFile = async (blob: Blob): ParsedResult => {
  const reader = new FileReader();
  const arrayBuffer = await new Promise<ArrayBuffer>((resolve) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(blob);
  });

  const result = await mammoth.convertToHtml({ arrayBuffer });
  const doc = new DOMParser().parseFromString(result.value, "text/html");
  return doc.body.innerHTML;
};

export const parsePdfFile = async (blob: Blob): ParsedResult => {
  const arrayBuffer = await blob.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
};
