import type { AgentAIMessage } from '../types/types';
import { useXChat } from '@ant-design/x';
import { useAgent } from './useAgent';

export const useChat = (agentTuple: ReturnType<typeof useAgent>) => {
  const [agent] = agentTuple;
  return useXChat({
    agent,
    defaultMessages: [
      {
        id: 'init',
        message: {
          type: 'ai',
          content: 'Hello, what can I do for you?',
        },
        status: 'success',
      },
    ],
    requestPlaceholder: { type: 'ai', content: 'Waiting...' },
    parser: (agentMessages) => {
      const list = agentMessages.content ? [agentMessages] : (agentMessages as AgentAIMessage).list;
      return (list || []).map((msg) => ({
        role: msg.type,
        content: msg.content,
      }));
    },
  });
};