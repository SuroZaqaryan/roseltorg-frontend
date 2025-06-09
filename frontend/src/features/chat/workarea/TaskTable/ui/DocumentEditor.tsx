import { useState, useEffect, useRef } from 'react';
import { Typography, Flex, Button, Space, Divider, message } from 'antd';
import { Download } from 'lucide-react';
import { getFileExtension } from '@shared/lib/utils/getFileExtension';
import { useFilePreview } from '@shared/lib/useFilePreview.ts';
import { useChatStore } from '@stores/useChatStore';
import { useOfficeDownload } from '../lib/useOfficeDownload';
import cl from '../styles/DocEdtior.module.scss';

const { Text } = Typography;

const DocumentEditor = () => {
  const { uploadedFile } = useChatStore();
  const { officeContent } = useFilePreview();
  const { download } = useOfficeDownload();

  const ext = getFileExtension(uploadedFile?.name);

  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [editableContent, setEditableContent] = useState("");

  useEffect(() => {
    if (officeContent && contentRef.current) {
      setOriginalContent(officeContent);
      setEditableContent(officeContent);
      contentRef.current.innerHTML = officeContent;
    }
  }, [officeContent]);

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
    if (contentRef.current) {
      contentRef.current.innerHTML = originalContent;
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setOriginalContent(editableContent);
    message.success('Файл успешно сохранен');
    // TODO можно вызывать API сохранения
  };

  
  if (!uploadedFile) return null;
  
  const downloadFile = () => {
    download(uploadedFile.name, editableContent);
    message.success('Файл успешно скачан');
  }

  return (
    <>
      <Flex justify="space-between" wrap gap={20} align="center" style={{ marginBottom: 12 }}>
        <Text strong>{uploadedFile.name}</Text>

        <Space wrap>
          {!isEditing ? (
            <>
              <Button onClick={handleEdit}>Редактировать</Button>
              <Divider style={{ margin: 3 }} type="vertical" />
            </>
          ) : (
            <>
              <Button type="primary" onClick={handleSave}>Сохранить</Button>
              <Button onClick={handleCancel}>Отменить</Button>
              <Divider style={{ margin: 3 }} type="vertical" />
            </>
          )}
          <Button
            type="primary"
            onClick={downloadFile}
            icon={<Download size={16} />}>
            Скачать
          </Button>
        </Space>
      </Flex>

      <div
        className={`${cl.contentView} ${ext ? cl[ext] : ''}`}
        ref={contentRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onInput={handleInput}
      />
    </>
  );
};

export default DocumentEditor;