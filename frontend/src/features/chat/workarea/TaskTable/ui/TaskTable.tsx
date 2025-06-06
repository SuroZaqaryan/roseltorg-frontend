import React, { useEffect, useState } from "react";

import { Table, Typography, Flex, Button, message } from "antd";

import { SquarePen, Download } from "lucide-react";

import EditableRow from "./EditableRow";
import EditableCell from "./EditableCell";

import { handleSaveRow } from "../lib/helpers";
import { downloadFile } from "../lib/downloadFile";

import type { FileRow, CellValue } from "@features/chat/types/types";
import type { TaskUploadedFile } from "@stores/useChatStore";

import cl from "../styles/FilePreviewTable.module.scss";


const { Text } = Typography;

interface FilePreviewTableProps {
  filePreview: FileRow[];
  uploadedFile: TaskUploadedFile | null;
}

const TaskTable: React.FC<FilePreviewTableProps> = ({ filePreview, uploadedFile }) => {
  const [editing, setEditing] = useState(false);
  const [dataSource, setDataSource] = useState<FileRow[]>([]);

  useEffect(() => {
    if (filePreview?.length) {
      setDataSource(filePreview.map((row, index) => ({ ...row, key: index.toString() })));
    }
  }, [filePreview]);

  if (!filePreview?.length) return null;

  const headers = Object.keys(filePreview[0] || {});
  const handleSave = handleSaveRow(dataSource, setDataSource);

  const defaultColumns = headers.map((header) => ({
    title: header,
    dataIndex: header,
    key: header,
    ellipsis: true,
    render: (text: CellValue) => {
      if (text == null) return '-';
      if (typeof text === 'boolean') return text.toString();
      return text;
    },
    onCell: (record: FileRow) => ({
      record,
      editable: editing,
      dataIndex: header,
      title: header,
      handleSave,
    }),
  }));

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const saveChanges = () => {
    setEditing(!editing);
    message.success(`Файл успешно сохранён`);
  };

  const handleDownload = () => {
    downloadFile(uploadedFile, dataSource);
  };

  return (
    <Table
      columns={defaultColumns}
      dataSource={dataSource}
      className={cl.table}
      bordered
      pagination={false}
      components={components}
      title={() => (
        <Flex align="center" justify="space-between">
          <Text style={{ fontWeight: 500 }}>{uploadedFile?.name}</Text>
          <Flex align="center" gap={16}>
            {editing ? (
              <Button
                type="primary"
                shape="round"
                style={{ lineHeight: 1, background: '#389e0d', boxShadow: 'none' }}
                onClick={saveChanges}
              >
                Сохранить
              </Button>
            ) : (
              <Flex
                onClick={() => setEditing(!editing)}
                style={{ cursor: 'pointer' }}
                title="Редактировать"
              >
                <SquarePen size={18} color="gray" />
              </Flex>
            )}

            <Flex onClick={handleDownload} style={{ cursor: 'pointer' }} title="Скачать">
              <Download size={18} color="gray" />
            </Flex>
          </Flex>
        </Flex>
      )}
    />
  );
};

export default TaskTable;
