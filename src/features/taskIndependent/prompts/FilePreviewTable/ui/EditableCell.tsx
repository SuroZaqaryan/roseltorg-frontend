import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Input } from 'antd';
import type { InputRef } from 'antd';
import EditableContext from '../context/EditableContext';
import cl from '../styles/EditableCell.module.scss'

interface EditableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  cellTitle: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: any;
  handleSave: (record: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  cellTitle,
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
    if (editing) inputRef.current?.focus();
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
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const childNode = editable ? (
    editing ? (
      <Form.Item className={cl.inputItem} name={dataIndex} rules={[{ required: true, message: `${cellTitle} is required.` }]}>
        <Input ref={inputRef} className={cl.inputCell} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className={cl.editableCellValueWrap} onClick={toggleEdit}>
        {children}
      </div>
    )
  ) : (
    children
  );

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
