import React from 'react';
import { Drawer, Table, Select, Button, Flex } from 'antd';
import { ChevronDown } from "lucide-react";
import { useTaskStore } from '../../../shared/stores';
import { useKeywordsFilter } from '../model/useKeywordsFilter.ts';

interface TaskDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    columns: any[];
    dataSource: any[];
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({ open, setOpen, columns, dataSource }) => {
    const uploadedFile = useTaskStore((state) => state.uploadedFile);
    const {selectedKeywords, isKeywordsOpen, handleKeywordsChange, toggleKeywordsDropdown } = useKeywordsFilter();

    return (
        <Drawer
            title={`${uploadedFile?.name || 'Файл'}`}
            placement="right"
            size="large"
            onClose={() => setOpen(false)}
            open={open}
        >
            <Flex align="center" gap={12}>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    suffixIcon={<ChevronDown color="#8c8c8c" width={20} strokeWidth={1.5} />}
                    size="large"
                    open={isKeywordsOpen}
                    placeholder="Ключевые слова для исключения ТЗ"
                    value={selectedKeywords}
                    onChange={handleKeywordsChange}
                    onOpenChange={toggleKeywordsDropdown}
                />
                <Button
                    type="primary"
                    size="large"
                    disabled={!selectedKeywords.length}
                >
                    Применить
                </Button>
            </Flex>

            <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                pagination={false}
                virtual
                scroll={{ x: 2000, y: 500 }}
                style={{ margin: '25px 0 15px 0' }}
            />
        </Drawer>
    );
};

export default TaskDrawer;