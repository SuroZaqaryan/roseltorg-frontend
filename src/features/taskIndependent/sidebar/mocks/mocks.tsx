import { OpenAIFilled } from '@ant-design/icons';

export const MOCK_SESSION_LIST = [
    {
        key: '5',
        label: 'Новая сессия',
        group: 'Сегодня',
    },
    {
        key: '4',
        label: 'Что ты умеешь делать?',
        group: 'Сегодня',
    },
    {
        key: '3',
        label: 'Новый гибридный интерфейс AGI',
        group: 'Сегодня',
    },
    {
        key: '2',
        label: 'Как внести изменения в ТЗ?',
        group: 'Вчера',
    },
    {
        key: '1',
        label: 'Что ты умеешь делать?',
        group: 'Вчера',
    },
];

export const MOCK_SUGGESTIONS = [
    { label: 'Write a report', value: 'report' },
    { label: 'Draw a picture', value: 'draw' },
    {
        label: 'Check some knowledge',
        value: 'knowledge',
        icon: <OpenAIFilled />,
        children: [
            { label: 'About React', value: 'react' },
            { label: 'About Ant Design', value: 'antd' },
        ],
    },
];

export const MOCK_QUESTIONS = [
    'Что ты умеешь делать?',
    'Как создать новое ТЗ?',
    'Как внести изменения в ТЗ?',
];