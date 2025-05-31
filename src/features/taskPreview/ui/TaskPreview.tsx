import React, { useState } from 'react';
import TaskTitle from '../../../shared/ui/task-title/TaskTitle.tsx';
import TaskDrawer from './TaskDrawer.tsx'
import TaskTable from "./TaskTable.tsx";
import { TableProperties } from 'lucide-react';
import {useParsedExcel} from "../model/useParsedExcel.ts";

export const TaskPreview: React.FC = () => {
    const { sectionRef, columns, dataSource } = useParsedExcel();

    const [openDrawer, setOpenDrawer] = useState(false);

    return (
        <div ref={sectionRef}>
            <TaskTitle icon={TableProperties} title="Предпросмотр ТЗ" />

            <TaskTable
                columns={columns}
                dataSource={dataSource}
                setOpenDrawer={setOpenDrawer}
            />

            <TaskDrawer
                open={openDrawer}
                setOpen={setOpenDrawer}
                columns={columns}
                dataSource={dataSource}
            />
        </div>
    );
};