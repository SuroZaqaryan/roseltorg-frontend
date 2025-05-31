import { useEffect, useRef, useState } from 'react';
import { useTaskStore } from '../../../shared/stores';
import * as XLSX from 'xlsx';

export const useParsedExcel = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const uploadedFile = useTaskStore((state) => state.uploadedFile);

    const [columns, setColumns] = useState<any[]>([]);
    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        if (!uploadedFile) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const fileBuffer = e.target?.result;
            if (!fileBuffer) return;

            const workbook = XLSX.read(fileBuffer, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length === 0) return;

            const [headers, ...restRows] = jsonData;
            const typedHeaders = headers as string[];

            const cols = typedHeaders.map((header: string, index: number) => ({
                title: header,
                dataIndex: `col${index}`,
                key: `col${index}`,
            }));

            const tableData = (restRows as any[][]).map((row, rowIndex) => {
                const rowData: Record<string, any> = { key: rowIndex };
                row.forEach((cell, i) => {
                    rowData[`col${i}`] = cell;
                });
                return rowData;
            });

            setColumns(cols);
            setDataSource(tableData);
        };

        reader.readAsArrayBuffer(uploadedFile);
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [uploadedFile]);

    return { sectionRef, columns, dataSource };
};
