import React from 'react';
import { Select, Flex, Button } from 'antd';
import { KeyRound } from 'lucide-react';
import { ChevronDown } from "lucide-react";
import { useGenerateTask } from '../model/useGenerateTask';
import TaskTitle from "../../../shared/ui/task-title/TaskTitle.tsx"

export const GenerateTask: React.FC = () => {
    const {
        selectedKeywords,
        isSelectOpen,
        handleChange,
        handleOpenChange,
    } = useGenerateTask();

    return (
        <section>
            <TaskTitle icon={KeyRound} iconSize={20} title="Ключевые слова" />

            <Flex gap={18} vertical>
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    suffixIcon={<ChevronDown color="#8c8c8c" width={20} strokeWidth={1.5} />}
                    size="large"
                    open={isSelectOpen}
                    placeholder="Ключевые слова для генерации ТЗ"
                    value={selectedKeywords}
                    onChange={handleChange}
                    onOpenChange={handleOpenChange}
                />

                <Button
                    type="primary"
                    size='large'
                    disabled={!selectedKeywords.length}
                >
                    Генерировать
                </Button>
            </Flex>
        </section>
    );
};