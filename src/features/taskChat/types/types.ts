import type { GetProp } from 'antd';
import { Bubble } from '@ant-design/x';

export type AgentUserMessage = { type: 'user'; content: string };
export type AgentAIMessage = {
  type: 'ai';
  content?: string;
  list?: ({ type: 'text'; content: string } | { type: 'suggestion'; content: string[] })[];
};
export type AgentMessage = AgentUserMessage | AgentAIMessage;

export type BubbleRoles = GetProp<typeof Bubble.List, 'roles'>;