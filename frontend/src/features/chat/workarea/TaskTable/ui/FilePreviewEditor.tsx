import { useState, useEffect, useRef } from 'react';
import { Typography, Spin, Flex, Button, Space, Divider, message } from "antd";
import { Download } from "lucide-react";
import PdfPreview from "./PdfPreview.tsx";
import { getFileExtension } from "@shared/lib/utils/getFileExtension";
import { useFilePreview } from "@shared/lib/useFilePreview.ts";
import { useChatStore } from "@stores/useChatStore";
import cl from '../styles/TaskTable.module.scss';

const { Text } = Typography;

const FilePreviewEditor = () => {
  const { uploadedFile } = useChatStore();
  const { content, loading } = useFilePreview();
  const ext = getFileExtension(uploadedFile?.name);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalContent, setOriginalContent] = useState<string | Blob | null>(null);
  const [editableContent, setEditableContent] = useState<string | Blob | null>(null);


  useEffect(() => {
    if (!contentRef.current) return;

    if (typeof content === 'string') {
      setOriginalContent(content);
      setEditableContent(content);
      contentRef.current.innerHTML = content;
    }
  }, [content]);


  const handleInput = () => {
    if (contentRef.current) {
      setEditableContent(contentRef.current.innerHTML);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableContent(originalContent);
    if (contentRef.current && typeof originalContent === "string") {
      contentRef.current.innerHTML = originalContent;
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setOriginalContent(editableContent);
    message.success('Файл успешно сохранен');
    // TODO можно вызывать API сохранения
  };

  const renderContent = () => {
    if (loading) {
      return <Spin />;
    }

    if (ext === 'pdf' && content instanceof Blob) {
      return <PdfPreview content={content} />;
    }

    return (
        <div
            className={`${cl.contentView} ${ext ? cl[ext] : ''}`}
            ref={contentRef}
            contentEditable={isEditing && ext !== 'pdf'}
            suppressContentEditableWarning
            onInput={handleInput}
        />
    );
  };


  if (!uploadedFile) return null;

  return (
    <div style={{ padding: 16 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <Text strong>{uploadedFile.name}</Text>
        <Space>
          {!isEditing ? (
            <>
              <Button onClick={handleEdit}>Редактировать</Button>
              <Divider style={{ margin: 3 }} type="vertical" />
            </>
          )
              : (
            <>
              <Button type="primary" onClick={handleSave}>Сохранить</Button>
              <Button onClick={handleCancel}>Отменить</Button>
              <Divider style={{ margin: 3 }} type="vertical" />
            </>
          )}
          <Button icon={<Download size={16} />}>Скачать</Button>
        </Space>
      </Flex>

      {renderContent()}
    </div>
  );
};

export default FilePreviewEditor;
