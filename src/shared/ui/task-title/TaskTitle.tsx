import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

type TaskTitleProps = {
    icon: React.ElementType;
    title: string;
    iconSize?: number;
};

const TaskTitle: React.FC<TaskTitleProps> = ({ icon: Icon, title, iconSize = 22 }) => (
    <Title level={3} className='flex-items-center' style={{marginBottom: 25}}>
        <Icon size={iconSize} style={{ marginTop: '3px' }} />
        {title}
    </Title>
);

export default TaskTitle;