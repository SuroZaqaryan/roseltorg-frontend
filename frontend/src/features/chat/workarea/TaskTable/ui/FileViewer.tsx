import { Spin } from 'antd';
import PdfPreview from "./PdfPreview.tsx";
import DocumentEditor from "./DocumentEditor.tsx";
import { getFileExtension } from "@shared/lib/utils/getFileExtension";
import { useChatStore } from "@stores/useChatStore";
import { useFilePreview } from "@shared/lib/useFilePreview.ts";

const FileViewer = () => {
    const { uploadedFile } = useChatStore();
    const ext = getFileExtension(uploadedFile?.name);
    const { loading } = useFilePreview();

    const isPdf = ext === 'pdf';
    const isOffice = ext === 'xls' || ext === 'xlsx' || ext === 'docx';

    if (loading) return <Spin />;

    return (
        <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {isPdf && <PdfPreview />}
            {isOffice && <DocumentEditor />}
        </div>
    );

};

export default FileViewer;
