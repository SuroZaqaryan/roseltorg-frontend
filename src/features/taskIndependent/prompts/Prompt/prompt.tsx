import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {Rocket, BookCopy} from 'lucide-react'
import { Prompts, Welcome } from '@ant-design/x';
import type { PromptsProps } from '@ant-design/x';
import FilePreviewTable from '../FilePreviewTable/ui/FilePreviewTable';
import { useTaskStore } from '../../../../shared/stores/useCopilot';
import { App, ConfigProvider, Space, Card, Flex, theme, Skeleton } from 'antd';
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

const { useToken } = theme;

const Prompt = () => {
  const { token } = useToken();
  const { message } = App.useApp();
  const { uploadedFile } = useTaskStore();

  const [filePreview, setFilePreview] = useState<any[][] | null>(null);
  const [loadingTable, setLoadingTable] = useState(false);

  const previewFile = async () => {
    if (!uploadedFile || typeof uploadedFile !== 'object' || !uploadedFile.url) return;

    try {
      setLoadingTable(true);

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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        setFilePreview(jsonData as any[][]);
      };

      reader.readAsBinaryString(blob);
    } catch (error) {
      console.error('Ошибка при обработке файла:', error);
    } finally {
      setLoadingTable(false);
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
      <div style={{ width: '100%', height: '100%' }}>
        <Flex
          justify='center'
          className={cl.promptContainer}
          style={{
            borderRadius: filePreview ? undefined : '16px',
            border: filePreview ? undefined : `1px solid ${token.colorBorder}`,
          }}
        >
          <Flex
            vertical
            gap={44}
            className={cl.promptContent}
            style={{
              maxWidth: filePreview ? undefined : 1000,
              padding: filePreview ? 0 : 32,
            }}
          >
            {filePreview ?
              <>
                {
                  loadingTable ?
                    <Skeleton
                      active
                      title={false}
                      paragraph={{ rows: 12, width: ['100%', '80%', '90%', '60%'] }}
                    />
                    :
                    <FilePreviewTable filePreview={filePreview} uploadedFile={uploadedFile} />
                }
              </>
              :
              <>
                <Card className={cl.welcomeCard}>
                  <Welcome
                    variant="borderless"
                    icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                    title="Привет! Какой у тебя сегодня запрос?"
                    description="Я помогу вам быстро составить или обновить ТЗ — просто начните с запроса в чате!"
                  />
                </Card>

                <Prompts
                  title="Что вы хотите сделать?"
                  items={items}
                  wrap
                  styles={{
                    title: {
                      color: token.colorPrimary,
                      marginBottom: '0.8rem'
                    },
                    list: {
                      width: '100%',
                      gap: 22,
                    },
                    itemContent: {
                      gap: 8
                    },
                    item: {
                      flex: 1,
                      background: `#fff`,
                      border: `1px solid #dedede`,
                      color: '#3e3e3e',
                      borderRadius: 16,
                      padding: '24px',
                    },
                    subItem: {
                      background: '#fafafa',
                      border: `1px solid #f0f0f0`,
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
        </Flex>
      </div>
    </ConfigProvider>
  );
};

export default Prompt;
