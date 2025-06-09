import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Flex, Typography, Tooltip, Button } from 'antd';
import { Plus, Minus, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFilePreview } from "@shared/lib/useFilePreview.ts";
import { useChatStore } from "@stores/useChatStore";
import { usePdfDownload } from "../lib/usePdfDownload";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const { Text } = Typography;

function PdfPreview() {
    const { uploadedFile } = useChatStore();
    const { contentPdf } = useFilePreview();

    const [scale, setScale] = useState(1.0);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState<number | null>(null);

    const downloadPdf = usePdfDownload(contentPdf, uploadedFile?.name || 'document.pdf');

    useEffect(() => {
        setNumPages(null);
        setPageNumber(1);
    }, [contentPdf]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function goToPrevPage() {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    }

    function goToNextPage() {
        if (numPages && pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    }

    function zoomIn() {
        setScale(prev => Math.min(prev + 0.25, 3.0));
    }

    function zoomOut() {
        setScale(prev => Math.max(prev - 0.25, 0.5));
    }

    return (
        <>
            <Flex justify='space-between' wrap="wrap" gap={10} style={{ marginBottom: 20 }}>
                <Text strong>{uploadedFile?.name}</Text>

                <Flex align='center' gap={24}>
                    <Flex align='center' gap={6}>
                        <Tooltip title="Уменьшить">
                            <Button onClick={zoomOut} disabled={scale <= 0.5} variant="outlined" shape="circle" size='small' icon={<Minus size={14} />} />
                        </Tooltip>

                        <Text style={{ fontSize: '14px' }}>{Math.round(scale * 100)}%</Text>

                        <Tooltip title="Увеличить">
                            <Button onClick={zoomIn} disabled={scale >= 3.0} variant="outlined" shape="circle" size='small' icon={<Plus size={14} />} />
                        </Tooltip>
                    </Flex>


                    <Flex align='center' gap={12}>
                        <Tooltip title="Следующий">
                            <Button onClick={goToPrevPage} variant="outlined" shape="circle" size='small' icon={<ChevronLeft size={14} />} />
                        </Tooltip>

                        <Text style={{ fontSize: 14 }}>Страница {pageNumber} из {numPages ?? '?'}</Text>

                        <Tooltip title="Предыдущий">
                            <Button onClick={goToNextPage} variant="outlined" shape="circle" size='small' icon={<ChevronRight size={14} />} />
                        </Tooltip>
                    </Flex>
                    
                    <Button onClick={downloadPdf} type="primary" icon={<Download size={16} />}>
                        Скачать
                    </Button>
                </Flex>
            </Flex>

          <Flex gap={20} style={{ overflow: 'hidden', alignItems: 'flex-start' }}>
    {numPages && (
        <div
            style={{
                width: '150px',
                position: 'sticky',
                top: 0,
                maxHeight: '80vh',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                flexShrink: 0,
            }}
        >
            <Document file={contentPdf} loading="Loading thumbnails...">
                {Array.from(new Array(numPages), (_, index) => (
                    <div
                        key={`thumb_${index + 1}`}
                        onClick={() => setPageNumber(index + 1)}
                        style={{
                            marginBottom: '10px',
                            cursor: 'pointer',
                            border: pageNumber === index + 1 ? '2px solid #1c1c1c' : '1px solid #ccc',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}
                    >
                        <Page
                            pageNumber={index + 1}
                            width={120}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                        />
                    </div>
                ))}
            </Document>
        </div>
    )}

    <div
        style={{
            flex: 1,
            overflow: 'auto',
            maxHeight: '80vh',
        }}
    >
        <Document
            file={contentPdf}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="Загрузка PDF..."
        >
            <Page
                pageNumber={pageNumber}
                scale={scale}
                width={Math.min(800 * scale, window.innerWidth - 200)}
            />
        </Document>
    </div>
</Flex>

        </>
    );
}

export default PdfPreview;
