import React from 'react';
import { Flex } from 'antd';
// import {GenerateTask} from '../features/taskGenerate';
import ChatBox from '../features/taskIndependent/ChatBox.tsx';

const HomePage: React.FC = () => {
    return (
        <Flex gap={12} vertical style={{ height: '100%' }}>
            <ChatBox />
        </Flex>
    );
};

export default HomePage;