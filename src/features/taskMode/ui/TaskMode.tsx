import React from 'react';
import { Radio, Flex } from 'antd';
import type { RadioChangeEvent } from 'antd';
import TaskTitle from '../../../shared/ui/task-title/TaskTitle';
import { ChevronsLeftRightEllipsis } from 'lucide-react';
import {useTaskStore} from "../../../shared/stores";
import StepLine from "../../../shared/ui/step-line/StepLine.tsx";

type Mode = 'generate' | 'edit';

interface Props {
    taskMode: Mode;
    setTaskMode: (mode: Mode) => void;
}

export const TaskMode: React.FC<Props> = ({ taskMode, setTaskMode }) => {
    const activeStep = useTaskStore((state) => state.activeStep);

    const handleModeChange = (e: RadioChangeEvent) => {
        setTaskMode(e.target.value);
    };

    return (
       <>
           <section>
               <Flex justify='center' vertical>
                   <TaskTitle icon={ChevronsLeftRightEllipsis} title="Выберите режим работы" />

                   <Radio.Group
                       block
                       value={taskMode}
                       style={{ width: '100%' }}
                       onChange={handleModeChange}
                       size="large"
                       buttonStyle="solid"
                   >
                       <Radio.Button value="generate">Сгенерировать ТЗ</Radio.Button>
                       <Radio.Button value="edit">Редактировать ТЗ</Radio.Button>
                   </Radio.Group>
               </Flex>
           </section>

           <StepLine active={activeStep >= 1} />
       </>
);
};