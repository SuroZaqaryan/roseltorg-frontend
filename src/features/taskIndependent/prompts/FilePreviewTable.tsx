import React from 'react';
import { Table, Typography, Flex , Button} from 'antd';
import type { TableProps } from 'antd';
import cl from './FilePreviewTable.module.scss'
import type { TaskUploadedFile } from '../../../shared/stores/useCopilot'

interface FilePreviewTableProps {
    filePreview: any[][];
    uploadedFile: TaskUploadedFile | null,
}

const { Text } = Typography;


const FilePreviewTable: React.FC<FilePreviewTableProps> = ({ filePreview, uploadedFile }) => {
    if (!filePreview || filePreview.length === 0) {
        return null;
    }

    console.log('uploadedFile', uploadedFile);


    const headers = Object.keys(filePreview[0] || {});

    const columns: TableProps<any>['columns'] = headers.map((header) => ({
        title: header,
        dataIndex: header,
        key: header,
        ellipsis: true,
        render: (text) => {
            if (text == null) return '-';
            if (typeof text === 'boolean') return text.toString();
            return text;
        },
    }));


    const dataSource = filePreview.map((row, index) => ({
        ...row,
        key: index.toString(),
    }));

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            className={cl.table}
            bordered
            pagination={false}
            title={() => (
                <Flex align='center' justify='space-between'>
                    <Text style={{ fontWeight: 500 }}>{uploadedFile?.name}</Text>
                    <Flex gap={8}>
                        <Button style={{background: '#706b9e', color: '#fff', lineHeight: 1}} >Редактировать</Button>
                        <Button variant='outlined' style={{lineHeight: 1}}>Скачать</Button>
                    </Flex>
                </Flex>
            )}
            virtual
        />
    );
};

export default FilePreviewTable;