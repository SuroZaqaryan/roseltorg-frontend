import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Prompts } from '@ant-design/x';
import type { BubbleRoles } from '../types/types';

export const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

export const roles: BubbleRoles = {
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
  text: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
  },
  suggestion: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (content) => (
      <Prompts
        vertical
        items={(content as any as string[]).map((text) => ({
          key: text,
          icon: <SmileOutlined style={{ color: '#FAAD14' }} />,
          description: text,
        }))}
      />
    ),
  },
};