import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import cl from './FilePreviewTable.module.scss'

interface FilePreviewTableProps {
    filePreview: any[][];
    containerHeight?: number;
}

const FilePreviewTable: React.FC<FilePreviewTableProps> = ({ filePreview, containerHeight }) => {
    if (!filePreview || filePreview.length === 0) {
        return null;
    }

    const isSingleRow = !Array.isArray(filePreview[0]);

    const normalizedData = isSingleRow ? [filePreview] : filePreview;

    const headers = normalizedData[0]?.map((_, index) => `Колонка ${index + 1}`) || [];

    const dataRows = isSingleRow ? normalizedData : normalizedData.slice(1);

    const columns: TableProps<any>['columns'] = headers.map((header, index) => ({
        title: header,
        dataIndex: index.toString(),
        key: index.toString(),
         ellipsis: true,
        render: (text) => {
            if (text == null) return '-';
            if (typeof text === 'boolean') return text.toString();
            return text;
        },
    }));

    const dataSource = dataRows.map((row, rowIndex) => {
        const rowObject: Record<string, any> = { key: rowIndex.toString() };

        // Обрабатываем как массив значений
        if (Array.isArray(row)) {
            row.forEach((cell, cellIndex) => {
                rowObject[cellIndex.toString()] = cell;
            });
        } else {
            // Если строка - это объект (на случай если данные придут в другом формате)
            Object.entries(row).forEach(([key, value]) => {
                rowObject[key] = value;
            });
        }

        return rowObject;
    });

    console.log('containerHeight', containerHeight)
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            className={cl.table}
            bordered
            pagination={false}
            virtual
            // scroll={{ x: 2000, y: containerHeight ? containerHeight - 60 : 400, }}
        />
    );
};

export default FilePreviewTable;