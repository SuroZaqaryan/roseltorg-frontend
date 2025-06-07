import React, { useState, useEffect, useRef } from 'react';
import { Typography, Spin, Flex, Button } from "antd";
import { Download } from "lucide-react";

import { useFilePreview } from "../../EntryPanel/lib/useFilePreview";
import { useChatStore } from "@stores/useChatStore";
import cl from '../styles/TaskTable.module.scss';

const { Text } = Typography;

const TaskTable = () => {
  const { uploadedFile } = useChatStore();
  const { content, loading } = useFilePreview();
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [editableContent, setEditableContent] = useState("");

  useEffect(() => {
    if (content && contentRef.current && !hasInitialized) {
      contentRef.current.innerHTML = content;
      setEditableContent(content);
      setHasInitialized(true);
    }
  }, [content, hasInitialized]);

  const handleInput = () => {
    if (contentRef.current) {
      setEditableContent(contentRef.current.innerHTML);
    }
  };

  if (!uploadedFile) return null;

  return (
    <div style={{ padding: 16 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <Text strong>{uploadedFile.name}</Text>
        <Button icon={<Download size={16} />}>Скачать</Button>
      </Flex>

      {loading ? (
        <Spin />
      ) : (
        <div
          className={cl.contentView}
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
        />
      )}
    </div>
  );
};

export default TaskTable;
