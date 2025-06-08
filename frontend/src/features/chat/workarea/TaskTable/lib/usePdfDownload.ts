import { useCallback } from 'react';

export function usePdfDownload(
  pdfSrc: string | Blob | Uint8Array | null | undefined,
  filename = 'document.pdf'
) {
  return useCallback(() => {
    if (!pdfSrc) return;

    let url: string;

    if (typeof pdfSrc === 'string') {
      url = pdfSrc;
    } else {
      const blob = pdfSrc instanceof Blob ? pdfSrc : new Blob([pdfSrc], { type: 'application/pdf' });
      url = URL.createObjectURL(blob);
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    if (typeof pdfSrc !== 'string') {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, [pdfSrc, filename]);
}
