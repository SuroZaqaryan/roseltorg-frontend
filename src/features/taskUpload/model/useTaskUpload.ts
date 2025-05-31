import { useState } from 'react';
import type { UploadProps } from 'antd';
import { useTaskStore } from '../../../shared/stores';

export const useTaskUpload = () => {
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');

    const uploadedFile = useTaskStore((state) => state.uploadedFile);
    const setActiveStep = useTaskStore((state) => state.setActiveStep);
    const setUploadedFile = useTaskStore((state) => state.setUploadedFile);

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        action: 'https://api.escuelajs.co/api/v1/files/upload',

        onChange(info) {
            const { status } = info.file;

            if (status === 'uploading') {
                setUploadStatus('uploading');
            } else if (status === 'done') {
                setUploadStatus('done');
                setUploadedFile(info.file.originFileObj || null);
                setActiveStep(2);
            } else if (status === 'error') {
                setUploadStatus('error');
            } else {
                setUploadStatus('idle');
            }
        },

        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return {
        uploadStatus,
        uploadedFile,
        uploadProps,
    };
};
