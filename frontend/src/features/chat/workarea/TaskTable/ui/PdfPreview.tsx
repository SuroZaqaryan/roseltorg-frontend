import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function PdfPreview({ content }: { content: Blob }) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [showThumbnails, setShowThumbnails] = useState(false);

    // При смене content сбрасываем страницу и кол-во страниц
    useEffect(() => {
        setNumPages(null);
        setPageNumber(1);
    }, [content]);

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

    function toggleThumbnails() {
        setShowThumbnails(!showThumbnails);
    }

    if (!content) {
        return <div>No PDF content provided.</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={toggleThumbnails}>
                    {showThumbnails ? 'Hide Thumbnails' : 'Show Thumbnails'}
                </button>
                <button onClick={goToPrevPage} disabled={pageNumber <= 1}>Previous</button>
                <span>Page {pageNumber} of {numPages ?? '?'}</span>
                <button onClick={goToNextPage} disabled={numPages ? pageNumber >= numPages : true}>Next</button>
                <button onClick={zoomOut} disabled={scale <= 0.5}>-</button>
                <span>{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} disabled={scale >= 3.0}>+</button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                {showThumbnails && numPages && (
                    <div style={{
                        width: '150px',
                        overflowY: 'auto',
                        maxHeight: '80vh',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '10px',
                        backgroundColor: '#f5f5f5'
                    }}>
                        <Document file={content} loading="Loading thumbnails...">
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
                        file={content}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading="Loading PDF..."
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            width={Math.min(800 * scale, window.innerWidth - (showThumbnails ? 200 : 40))}
                        />
                    </Document>
                </div>
            </div>
        </div>
    );
}

export default PdfPreview;
