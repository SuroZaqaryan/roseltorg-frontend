import { App, Card, ConfigProvider, Flex, theme } from "antd";
import { Welcome, Prompts } from "@ant-design/x";

import FileViewer from "../../TaskTable/ui/FileViewer.tsx";
import { useChatStore } from "@stores/useChatStore";
import { getPromptItems } from "../lib/getPromptItems";

import cl from "../styles/entryPanel.module.scss";

const EntryPanel = () => {
  const { uploadedFile } = useChatStore();
  const { token } = theme.useToken();
  const { message } = App.useApp();

  const hasFile = Boolean(uploadedFile?.name);

  const containerStyle = {
    borderRadius: hasFile ? undefined : "16px",
    border: hasFile ? undefined : `1px solid ${token.colorBorder}`,
  };

  const contentStyle = {
    maxWidth: hasFile ? undefined : 1000,
    padding: hasFile ? 0 : 32,
  };

  const renderPrompts = () => (
    <>
      <Card className={cl.welcomeCard}>
        <Welcome
          variant="borderless"
          icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
          title="Привет! Какой у тебя сегодня запрос?"
          description="Я помогу вам быстро составить или обновить ТЗ — просто начните с запроса в чате!"
        />
      </Card>

      <Prompts
        title="Что вы хотите сделать?"
        items={getPromptItems()}
        wrap
        styles={{
          title: { color: token.colorPrimary },
          list: { width: "100%", gap: 22 },
          item: { flex: 1, borderRadius: 16, padding: 24 },
        }}
        onItemClick={(info) => message.success(`You clicked a prompt: ${info.data.key}`)}
      />
    </>
  );

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <div style={{ width: "100%", height: "100%" }}>
        <Flex justify="center" className={cl.promptContainer} style={containerStyle}>
          <Flex vertical gap={44} className={cl.promptContent} style={contentStyle}>
            {hasFile ? <FileViewer /> : renderPrompts()}
          </Flex>
        </Flex>
      </div>
    </ConfigProvider>
  );
};

export default EntryPanel;
