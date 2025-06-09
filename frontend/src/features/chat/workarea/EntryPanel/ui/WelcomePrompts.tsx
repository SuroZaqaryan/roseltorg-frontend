import { Card, Flex, theme, App } from "antd";
import { Welcome, Prompts } from "@ant-design/x";

import { getPromptItems } from "../lib/getPromptItems";
import cl from "../styles/WelcomePrompts.module.scss";

const WelcomePrompts = () => {
  const { token } = theme.useToken();
  const { message } = App.useApp();

  return (
    <div className={cl.welcomeCardContainer}>
      <Flex vertical gap={44} className={cl.welcomeCardContent}>
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
      </Flex>
    </div>
  );
};

export default WelcomePrompts;
