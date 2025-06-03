import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Typography, Flex, Button, Form, Input } from 'antd';
import type { TableProps, GetRef, InputRef } from 'antd';
import cl from './FilePreviewTable.module.scss';
import type { TaskUploadedFile } from '../../../../shared/stores/useCopilot';

const { Text } = Typography;

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
  children: React.ReactNode;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: any;
  handleSave: (record: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface FilePreviewTableProps {
  filePreview: any[][];
  uploadedFile: TaskUploadedFile | null;
}

const FilePreviewTable: React.FC<FilePreviewTableProps> = ({ filePreview, uploadedFile }) => {
  const [editing, setEditing] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    if (filePreview && filePreview.length > 0) {
      setDataSource(filePreview.map((row, index) => ({
        ...row,
        key: index.toString(),
      })));
    }
  }, [filePreview]);

  if (!filePreview || filePreview.length === 0) {
    return null;
  }

  const headers = Object.keys(filePreview[0] || {});

  const handleSave = (row: any) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const defaultColumns = headers.map((header) => ({
    title: header,
    dataIndex: header,
    key: header,
    ellipsis: true,
    render: (text: any) => {
      if (text == null) return '-';
      if (typeof text === 'boolean') return text.toString();
      return text;
    },
    onCell: (record: any) => ({
      record,
      editable: editing,
      dataIndex: header,
      title: header,
      handleSave,
    }),
  }));

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  return (
    <Table
      columns={defaultColumns}
      dataSource={dataSource}
      className={cl.table}
      bordered
      pagination={false}
      components={components}
      rowClassName={() => 'editable-row'}
      title={() => (
        <Flex align='center' justify='space-between'>
          <Text style={{ fontWeight: 500 }}>{uploadedFile?.name}</Text>
          <Flex gap={8}>
            <Button 
              style={{background: editing ? '#52c41a' : '#706b9e', color: '#fff', lineHeight: 1}}
              onClick={toggleEdit}
            >
              {editing ? 'Сохранить' : 'Редактировать'}
            </Button>
            <Button style={{lineHeight: 1}}>Скачать</Button>
          </Flex>
        </Flex>
      )}
    />
  );
};

export default FilePreviewTable;