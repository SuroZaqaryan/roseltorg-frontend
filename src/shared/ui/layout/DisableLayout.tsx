import React from 'react';
import type { ReactNode } from 'react';

interface DisableLayoutProps {
    children: ReactNode;
    disabled?: boolean;
}

const DisableLayout: React.FC<DisableLayoutProps> = ({ children, disabled = false }) => {
    return (
        <div
            style={
                disabled
                    ? { pointerEvents: 'none', userSelect: 'none', opacity: 0.5 }
                    : undefined
            }
        >
            {children}
        </div>
    );
};

export default DisableLayout;