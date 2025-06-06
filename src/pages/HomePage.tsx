import React from 'react';
import { Flex } from 'antd';
import ChatBox from '@features/chat/ChatBox.tsx';

const HomePage: React.FC = () => {
    return (
        <Flex gap={12} vertical style={{ height: '100%' }}>
            <ChatBox />
        </Flex>
    );
};

export default HomePage;