import { useEffect, useState } from 'react';
import { Flex, Space, Button, theme, message as antdMessage } from 'antd';
import { Bubble, Sender } from '@ant-design/x';
import { roles } from './constants/constants';
import { useAgent } from './models/useAgent';
import { useChat } from './models/useChat';
import { SyncOutlined, CopyOutlined } from '@ant-design/icons';

import cl from './styles/TaskChat.module.scss';


const TaskChat = () => {
  const { token } = theme.useToken();

  const [content, setContent] = useState('');

  const [agent] = useAgent();
  const { onRequest, parsedMessages } = useChat([agent]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    onRequest({ type: 'user', content });
  };

  const onCopy = async (textToCopy: string) => {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      antdMessage.success('Скопировано в буфер обмена');
    } catch (err) {
      antdMessage.error('Не удалось скопировать текст');
    }
  };


  useEffect(() => {
    if (loading && !agent.isRequesting()) {
      setLoading(false);
      setContent('');
    }
  }, [agent.isRequesting(), loading]);

  return (
    <Flex className={cl.chat} vertical gap="middle">
      <Bubble.List
        roles={roles}
        className={cl.chat__list}
        items={parsedMessages.map(({ id, message, status }) => ({
          key: id,
          loading: status === 'loading',
          ...message,
          footer:
            message.role === 'text' ? (
              <Space size={token.paddingXXS}>
                <Button color="default" variant="text" size="small" icon={<SyncOutlined />} />
                <Button
                  color="default"
                  variant="text"
                  size="small"
                  onClick={() => onCopy(message.content as string)}
                  icon={<CopyOutlined />}
                />
              </Space>
            ) : undefined,
        }))}
      />


      <Sender
        submitType="shiftEnter"
        value={content}
        className={cl.chat__sender}
        loading={loading || agent.isRequesting()}
        onChange={setContent}
        onSubmit={handleSubmit}
        placeholder='Введите сообщение...'
        onCancel={() => {
          setLoading(false);
          antdMessage.info('Cancelled');
        }}
        actions={(_, info) => {
          const { SendButton, LoadingButton, ClearButton, SpeechButton } = info.components;

          return (
            <Space size="small">
              <ClearButton />
              <SpeechButton />
              {loading || agent.isRequesting() ? (
                <LoadingButton type="default" />
              ) : (
                <SendButton type="primary" disabled={!content.trim()} />
              )}
            </Space>
          );
        }}
      />
    </Flex>
  );
};

export default TaskChat;