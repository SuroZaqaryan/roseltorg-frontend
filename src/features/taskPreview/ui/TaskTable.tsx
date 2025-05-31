import React from 'react';
import {Button, Table} from 'antd';

interface TaskTableProps {
    columns: any[];
    dataSource: any[];
    setOpenDrawer: (open: boolean) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ columns, dataSource, setOpenDrawer }) => {
    return (
       <>
           <Table
               columns={columns}
               dataSource={dataSource}
               bordered
               pagination={false}
               virtual
               scroll={{ x: 2000, y: 500 }}
               style={{ marginBottom: 15 }}
           />

           <Button
               block
               type="primary"
               size='large'
               onClick={() => setOpenDrawer(true)}
               disabled={!dataSource.length}
           >
               Редактировать
           </Button>
       </>
    );
};

export default TaskTable;
