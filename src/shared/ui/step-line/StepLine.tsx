import React from 'react';
import cl from './StepLine.module.scss';

interface StepLineProps {
    width?: number | string;
    height?: number | string;
    color?: string;
    steps?: number;
    active?: boolean;
    gap?: number;
}

interface DotProps {
    active: boolean;
}

const Dot: React.FC<DotProps> = ({ active }) => {
    return (
        <span className={`${cl.dot} ${active ? cl.active : ''}`}>•</span>
    );
};

const StepLine: React.FC<StepLineProps> = ({
    width = 1,
    height = 200,
    color = '#1c1c1c',
    active = false,
    steps = 1,
    gap = 16,
}) => {
    const stepHeight =
        typeof height === 'number'
            ? (height - gap * (steps - 1)) / steps
            : `calc((${height} - ${gap * (steps - 1)}px) / ${steps})`;

    return (
        <div className={cl.container} style={{ width, height }}>

            {Array.from({ length: steps }).map((_, idx) => (
                <React.Fragment key={idx}>
                    <Dot active={active} />

                    <div
                        key={idx}
                        className={cl.step}
                        style={{
                            height: stepHeight,
                            background: active ? color : '#e0e0e0',
                            borderRadius: width,
                            marginBottom: idx !== steps - 1 ? gap : 0,
                        }}
                    />

                    <Dot active={active} />
                </React.Fragment>
            ))}

        </div>
    );
};

export default StepLine;