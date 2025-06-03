import { createStyles } from 'antd-style';

export const useWorkareaStyle = createStyles(({ token, css }) => {
  return {
    copilotWrapper: css`
        display: flex;
        height: 100%;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
       box-shadow: 0px 8px 15px 0px rgb(0 0 0 / 5%);
    border-radius: 16px;
        `,

    workarea: css`
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid  ${token.colorBorder};
      background: #fff;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      border-right: none;
      overflow: auto;
    `,
    workareaHeader: css`
      box-sizing: border-box;
         background: linear-gradient(90deg, #605b89e8 0%, #605b89bf 100%);
      border-top-left-radius: 16px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px 0 28px;
      border-bottom: 1px solid ${token.colorBorder};
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    headerButton: css`
      background-image: linear-gradient(78deg, #8054f2 7%, #3895da 95%);
      border-radius: 12px;
      height: 24px;
      width: 93px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s;
      &:hover {
        opacity: 0.8;
      }
    `,
    workareaBody: css`
      flex: 1;
      margin: 20px;
      background: ${token.colorBgContainer};
      min-height: 0;
      border-bottom-left-radius: 16px;
    `,
    bodyContent: css`
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      overflow: auto;
      // max-width: 1200px;
      // padding: 16px 32px;
      margin: 0 auto;
      height: 100%;
      ul {
        display: flex;
        flex-direction: column;
        gap: 14px;
        
        li {
            color: gray;
            line-height: 1.4;
        }
      }
    `,
    bodyText: css`
      color: ${token.colorText};
      padding: 8px;
    `,
  };
});