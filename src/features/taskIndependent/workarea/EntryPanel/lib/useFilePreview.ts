import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { useChatStore } from '../../../../../shared/stores/useChatStore.ts';

export const useFilePreview = () => {
    const { uploadedFile } = useChatStore();
    const [filePreview, setFilePreview] = useState<any[][] | null>(null);
    const [loadingTable, setLoadingTable] = useState(false);

    useEffect(() => {
        if (!uploadedFile || typeof uploadedFile !== 'object' || !uploadedFile.url) {
            setFilePreview(null);
            return;
        }

        const fetchFile = async () => {
            try {
                setLoadingTable(true);
                const res = await fetch(uploadedFile.url);
                const blob = await res.blob();

                const reader = new FileReader();
                reader.onload = (e) => {
                    const workbook = XLSX.read(e.target?.result, { type: 'binary' });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(sheet, { defval: null });
                    setFilePreview(data as any[][]);
                };
                reader.readAsBinaryString(blob);
            } catch (e) {
                console.error('Ошибка при загрузке файла', e);
            } finally {
                setLoadingTable(false);
            }
        };

        fetchFile();
    }, [uploadedFile]);

    return { filePreview, loadingTable };
};
