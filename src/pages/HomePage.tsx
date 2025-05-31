import React from 'react';
import { Flex } from 'antd';
// import {GenerateTask} from '../features/taskGenerate';
import TaskChatIndependent from '../features/taskIndependent/taskIndependent';

const HomePage: React.FC = () => {
    return (
        <Flex gap={12} vertical style={{ height: '100%' }}>
            <TaskChatIndependent />
        </Flex>
    );
};

export default HomePage;