import { Typography, Spin, Flex, Button } from "antd";
import { Download } from "lucide-react";

import { useFilePreview } from "../../EntryPanel/lib/useFilePreview";
import { useChatStore } from "@stores/useChatStore";
import cl from '../styles/TaskTable.module.scss';

const { Text } = Typography;

const TaskTable = () => {
  const { uploadedFile } = useChatStore();
  const { content, loading } = useFilePreview();

  if (!uploadedFile) return null;

  return (
    <div style={{ padding: 16 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <Text strong>{uploadedFile.name}</Text>
        <Button icon={<Download size={16} />}>
          Скачать
        </Button>
      </Flex>

      {loading ? (
        <Spin />
      ) : (
        <div
          className={cl.tableView}
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      )}
    </div>
  );
};

export default TaskTable;
