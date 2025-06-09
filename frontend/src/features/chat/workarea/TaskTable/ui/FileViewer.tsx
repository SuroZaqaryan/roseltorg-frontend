import { Spin, Flex, Result } from 'antd';
import cl from '../styles/FileViewer.module.scss'
import PdfPreview from "./PdfPreview.tsx";
import DocumentEditor from "./DocumentEditor.tsx";
import { getFileExtension } from "@shared/lib/utils/getFileExtension";
import { useChatStore } from "@stores/useChatStore";
import { useFilePreview } from "@shared/lib/useFilePreview.ts";
import ImgDocError from "@public/images/empty-data.jpg";

const FileViewer = () => {
    const { uploadedFile } = useChatStore();
    const ext = getFileExtension(uploadedFile?.name);
    const { loading, error } = useFilePreview();

    const isPdf = ext === 'pdf';
    const isOffice = ext === 'xls' || ext === 'xlsx' || ext === 'docx';

    if (loading) return <Spin />;

    return (
        <Flex className={cl.wrapper} vertical>
            {
                error ?
                    <Result
                        status="error"
                        icon={<img src={ImgDocError} width='250' height='250' />}
                        title="Что-то пошло не так"
                        subTitle={error}
                        className={cl.result}
                    />
                    :
                    <>
                        {isPdf && <PdfPreview />}
                        {isOffice && <DocumentEditor />}
                    </>
            }
        </Flex>
    );

};

export default FileViewer;
