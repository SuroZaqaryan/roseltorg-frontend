import type { AgentMessage } from '../types/types';
import { sleep } from '../constants/constants';
import { useXAgent } from '@ant-design/x';

export const useAgent = () => {
  return useXAgent<AgentMessage, { message: AgentMessage }, Record<string, any>>({
    request: async ({ message }, { onSuccess }) => {
      await sleep();
      const { content } = message || {};
      onSuccess([
        {
          type: 'ai',
          list: [
            { type: 'text', content: `Do you want?` },
            { type: 'suggestion', content: [`Look at: ${content}`, `Search: ${content}`, `Try: ${content}`] },
          ],
        },
      ]);
    },
  });
};