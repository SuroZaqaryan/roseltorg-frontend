import React from 'react';
import { Upload, Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Inbox } from 'lucide-react';
import { useTaskUpload } from '../model/useTaskUpload.ts';
import StepLine from "../../../shared/ui/step-line/StepLine.tsx";
import {useTaskStore} from "../../../shared/stores";

const { Dragger } = Upload;
const { Text } = Typography;

export const TaskUpload: React.FC = () => {
    const { uploadStatus, uploadedFile, uploadProps } = useTaskUpload();
    const activeStep = useTaskStore((state) => state.activeStep);


    return (
        <>
            <section>
                <Dragger
                    {...uploadProps}
                    style={{
                        borderColor: '#1c1c1c',
                        ...(uploadStatus === 'error' && { borderColor: '#cf1322' }),
                        ...(uploadStatus === 'done' && { borderColor: '#5b8c00' }),
                    }}
                >
                    {uploadStatus === 'uploading' ? (
                        <Spin
                            spinning
                            indicator={
                                <LoadingOutlined
                                    spin
                                    style={{ fontSize: 28, marginBottom: '10px' }}
                                />
                            }
                        />
                    ) : (
                        <Inbox
                            size={50}
                            strokeWidth={1}
                            color={
                                uploadStatus === 'error'
                                    ? '#cf1322'
                                    : uploadStatus === 'done'
                                        ? '#3f6600'
                                        : undefined
                            }
                        />
                    )}

                    {uploadedFile ? (
                        <Text style={{ display: 'block', marginTop: 0 }}>
                            <strong>Выбранный файл:</strong> {uploadedFile.name}
                        </Text>
                    ) : (
                        <>
                            <p className="ant-upload-text" style={{ fontWeight: '500' }}>
                                Нажмите или перетащите файл в эту область для загрузки
                            </p>
                            <p className="ant-upload-hint">
                                Поддержка одиночной или массовой загрузки. Строго запрещено загружать данные компании или другие запрещенные файлы.
                            </p>
                        </>
                    )}
                </Dragger>

                {uploadStatus === 'error' && (
                    <p style={{ color: '#cf1322', marginTop: 10, textAlign: 'center' }}>
                        Ошибка загрузки файла. Пожалуйста, попробуйте еще раз.
                    </p>
                )}
            </section>

            <StepLine active={activeStep >= 2} />
        </>
    );
};
