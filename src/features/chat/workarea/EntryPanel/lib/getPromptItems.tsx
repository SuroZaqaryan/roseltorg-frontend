import React from "react";

import { Space } from "antd";

import { Rocket, BookCopy } from "lucide-react";

import type { PromptsProps } from "@ant-design/x";


const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
        {icon}
        <span>{title}</span>
        </Space>
);

export const getPromptItems = (): PromptsProps['items'] => [
    {
        key: '1',
        label: renderTitle(<Rocket />, 'Автогенерация ТЗ'),
        description: 'Создайте техническое задание прямо в чате на основе текста в свободной форме',
        children: [
            {
                key: '3-1',
                description: `Я хочу закупить стулья себе в офис в размере 30 штук, по адресу г. Москва, Тверская улица 56, со сроком не больше 15 дней с момента подписания договора`,
            },
            {
                key: '3-2',
                description: `Нужны ноутбуки для сотрудников (10 штук), доставка — г. Казань, ул. Пушкина 21, срок — 5 дней`,
            },
        ],
    },
    {
        key: '2',
        label: renderTitle(<BookCopy  />, 'Загрузка и изменение ТЗ'),
        description: 'Загрузите готовый документ и дополните его новыми данными в чате',
        children: [
            {
                key: '2-1',
                description: `Хочу внести изменения в предыдущее ТЗ — теперь нужно 40 стульев, доставка туда же, но в течение 10 дней`,
            },
            {
                key: '2-2',
                description: `Есть старое ТЗ, нужно обновить: вместо мониторов закупить проекторы (5 шт), адрес и сроки те же`,
            },
        ],
    },
];
