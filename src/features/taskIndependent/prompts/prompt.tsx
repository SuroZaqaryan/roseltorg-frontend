import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  ReadOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { Prompts, Welcome } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';
import FilePreviewTable from './FilePreviewTable';
import { useTaskStore } from '../../../shared/stores/useCopilot';
import { App, ConfigProvider, Space, Card, Flex, theme } from 'antd';
import cl from './prompt.module.scss'

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const items: PromptsProps['items'] = [
  {
    key: '1',
    label: renderTitle(<RocketOutlined style={{ color: '#722ED1' }} />, 'Автогенерация ТЗ'),
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
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Загрузка и изменение ТЗ'),
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
const Prompt = () => {
  const { message } = App.useApp();
  const { uploadedFile } = useTaskStore();

  const [filePreview, setFilePreview] = useState<any[][] | null>(null);
  const [flexHeight, setFlexHeight] = useState<number>(0);
  const flexRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (flexRef.current) {
      setFlexHeight(flexRef.current.offsetHeight);
    }
  }, [filePreview]); 

  useEffect(() => {
    if (!flexRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          setFlexHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(flexRef.current);

    return () => observer.disconnect();
  }, []);

  const previewFile = async () => {
    if (!uploadedFile || typeof uploadedFile !== 'object' || !uploadedFile.url) return;

    try {
      const response = await fetch(uploadedFile.url);
      if (!response.ok) {
        throw new Error('Не удалось загрузить файл с сервера');
      }

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        setFilePreview(jsonData as any[][]);
      };

      reader.readAsBinaryString(blob);
    } catch (error) {
      console.error('Ошибка при обработке файла:', error);
    }
  };

  useEffect(() => {
    if (uploadedFile) {
      previewFile();
    } else {
      setFilePreview(null);
    }
  }, [uploadedFile]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Flex
        vertical
        ref={flexRef}
        gap={44}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: filePreview ? undefined : 1000,
          padding: filePreview ? 0 : 32,
        }}
      >


        {filePreview ?
          <FilePreviewTable filePreview={filePreview} containerHeight={flexHeight} />
          :
          <>
            <Card style={{ background: 'linear-gradient(97deg, #f2f9fe 0%, #f7f3ff 100%)', }}>
              <Welcome
                variant="borderless"
                icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                title="Привет! я ваш помощник OMI"
                description="OMI поможет вам быстро составить или обновить ТЗ — просто начните с запроса в чате!"
                style={{
                  borderStartStartRadius: 4,
                }}
              />
            </Card>

            <Prompts
              title="Что вы хотите сделать?"
              items={items}
              wrap
              className={cl.prompts}
              styles={{
                list: {
                  width: '100%',
                },
                item: {
                  flex: 1,
                  backgroundImage: `linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)`,
                  border: 0,
                  color: '#3e3e3e',
                },
                subItem: {
                  background: 'rgba(255,255,255,0.45)',
                  border: '1px solid #FFF',
                  height: '100%'
                },
              }}
              onItemClick={(info) => {
                message.success(`You clicked a prompt: ${info.data.key}`);
              }}
            />
          </>
        }
      </Flex>
    </ConfigProvider>
  );
};

export default Prompt;
