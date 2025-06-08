import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Flex, Typography, Tooltip, Button, Divider } from 'antd';
import { Plus, Minus, Download } from 'lucide-react';
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
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <Flex justify='space-between' wrap="wrap" gap={10} style={{ marginBottom: 20 }}>
                <Flex align='center' gap={8}>
                    <Text strong>{uploadedFile?.name}</Text>

                    <Divider type='vertical' />

                    <Flex align='center' gap={12}>
                        <Button onClick={goToPrevPage} type='primary' size='middle' disabled={pageNumber <= 1}>
                            <small>Следующий</small>
                        </Button>

                        <Text style={{ fontSize: 14 }}>Страница {pageNumber} из {numPages ?? '?'}</Text>

                        <Button onClick={goToNextPage} type='primary' size='middle' disabled={numPages ? pageNumber >= numPages : true}>
                            <small>Предыдущий</small>
                        </Button>
                    </Flex>
                </Flex>

                <Flex align='center' gap={8}>
                    <Flex align='center' gap={6}>
                        <Tooltip title="search">
                            <Button onClick={zoomOut} disabled={scale <= 0.5} variant="outlined" shape="circle" size='small' icon={<Minus size={14} />} />
                        </Tooltip>

                        <Text style={{ fontSize: '14px' }}>{Math.round(scale * 100)}%</Text>

                        <Tooltip title="search">
                            <Button onClick={zoomIn} disabled={scale >= 3.0} variant="outlined" shape="circle" size='small' icon={<Plus size={14} />} />
                        </Tooltip>
                    </Flex>

                    <Divider type='vertical' />

                    <Button  onClick={downloadPdf} icon={<Download size={16} />}>
                        Скачать
                    </Button>
                </Flex>
            </Flex>

            <div style={{ display: 'flex', gap: '20px' }}>
                {numPages && (
                    <div style={{
                        width: '150px',
                        overflowY: 'auto',
                        maxHeight: '80vh',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '10px',
                        backgroundColor: '#f5f5f5'
                    }}>
                        <Document file={contentPdf} loading="Loading thumbnails...">
                            {Array.from(new Array(numPages), (_, index) => (
                                <div
                                    key={`thumb_${index + 1}`}
                                    onClick={() => setPageNumber(index + 1)}
                                    style={{
                                        marginBottom: '10px',
                                        cursor: 'pointer',
                                        border: pageNumber === index + 1 ? '2px solid #0066ff' : '1px solid #ccc',
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

                <div style={{ flex: 1 }}>
                    <Document
                        file={contentPdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading="Loading PDF..."
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            width={Math.min(800 * scale, window.innerWidth - 200)}
                        />
                    </Document>
                </div>
            </div>
        </div>
    );
}

export default PdfPreview;
