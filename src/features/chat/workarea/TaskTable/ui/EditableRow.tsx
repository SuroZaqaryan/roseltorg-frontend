import React from 'react';
import { Form } from 'antd';
import EditableContext from '../context/EditableContext';

interface EditableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
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

export default EditableRow;
