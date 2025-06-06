import { App, Card, ConfigProvider, Flex, Skeleton, theme } from "antd";
import { Welcome, Prompts } from "@ant-design/x";

import { useChatStore } from "@stores/useChatStore";

import TaskTable from "../../TaskTable/ui/TaskTable.tsx";

import { getPromptItems } from "../lib/getPromptItems";
import { useFilePreview } from "../lib/useFilePreview";

import cl from "../styles/entryPanel.module.scss";


const EntryPanel = () => {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  // const { uploadedFile } = useChatStore();
  const { content, loading } = useFilePreview();

  return (
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <div style={{ width: '100%', height: '100%' }}>
          <Flex justify="center" className={cl.promptContainer} style={{ borderRadius: content ? undefined : '16px', border: content ? undefined : `1px solid ${token.colorBorder}` }}>
            <Flex vertical gap={44} className={cl.promptContent} style={{ maxWidth: content ? undefined : 1000, padding: content ? 0 : 32 }}>
              {content ? (
                  loading ? (
                      <Skeleton active title={false} paragraph={{ rows: 12, width: ['100%', '80%', '90%', '60%'] }} />
                  ) : (
                      <TaskTable  />
                  )
              ) : (
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
                            list: { width: '100%', gap: 22 },
                            item: { flex: 1, borderRadius: 16, padding: 24 }
                        }}
                        onItemClick={(info) => message.success(`You clicked a prompt: ${info.data.key}`)}
                    />
                  </>
              )}
            </Flex>
          </Flex>
        </div>
      </ConfigProvider>
  );
};

export default EntryPanel;
