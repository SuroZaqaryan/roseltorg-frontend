import { createStyles } from 'antd-style';

export const useCopilotStyle = createStyles(({ token, css }) => {
  return {
    copilotChat: css`
      display: flex;
      flex-direction: column;
      background: ${token.colorBgContainer};
      border: 1px solid  ${token.colorBorder};
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      border-left: 1px solid ${token.colorBorder};
      // border-left: none;
      color: ${token.colorText};
    `,
    // chatHeader 样式
    chatHeader: css`
      height: 52px;
      box-sizing: border-box;
      border-bottom: 1px solid ${token.colorBorder};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 16px;
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
    `,
    headerButton: css`
      font-size: 18px;
    `,
    conversations: css`
      width: 300px;
      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    // chatList 样式
    chatList: css`
      overflow: auto;
      padding-block: 16px;
      flex: 1;

      .ant-bubble-content {
        background: #8680b7;
        padding: 18px 20px;
        border-radius: 36px;
        font-size: 15px;
        color: ${token.colorTextLightSolid};
      }
    `,
    chatWelcome: css`
      margin-inline: 16px;
      padding: 12px 18px;
      border-radius: 2px 12px 12px 12px;
      background: #282828;
      margin-bottom: 16px;
    `,
    loadingMessage: css`
      background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
    `,
    // chatSend 样式
    chatSend: css`
      padding: 12px;
      .ant-sender-header-header {
        border-top-left-radius: 36px;
        border-top-right-radius: 36px;
        padding-block: 12px;
        padding-inline-start: 22px;
        padding-inline-end: 14px;
        background: #8680b7;

        .ant-sender-header-title,
        .ant-btn-icon > span {
          color: #fff;
        }
      }
        .ant-sender {
          border-radius: 32px;
          box-shadow: none;

          textarea {
            ::placeholder {
              // font-size: 16px;
            }
          }
        }
    `,
    sendAction: css`
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
    sendButton: css`
      background: #6b6691;
      box-shadow: none;
    `,
  };
});