import { useState } from 'react';
import Copilot from "./copilot/copilot.tsx";
import { useWorkareaStyle } from "./styles/useWorkareaStyle.ts";
import Prompt from './prompts/Prompt/prompt.tsx';

const CopilotDemo = () => {
    const { styles: workareaStyles } = useWorkareaStyle();

    const [copilotOpen, setCopilotOpen] = useState(true);

    return (
        <div className={workareaStyles.copilotWrapper}>
            {/** 左侧工作区 */}
            <div className={workareaStyles.workarea}>
                <div className={workareaStyles.workareaHeader}>
                    <div className={workareaStyles.headerTitle}>
                        Roseltorg
                    </div>
                    {!copilotOpen && (
                        <div onClick={() => setCopilotOpen(true)} className={workareaStyles.headerButton}>
                            ✨ Открыть
                        </div>
                    )}
                </div>

                <div
                    className={workareaStyles.workareaBody}
                // style={{ margin: copilotOpen ? 16 : '16px 48px' }}
                >
                    <div className={workareaStyles.bodyContent}>
                        <Prompt />
                    </div>
                </div>
            </div>

            {/** 右侧对话区 */}
            <Copilot copilotOpen={copilotOpen} setCopilotOpen={setCopilotOpen} />
        </div>
    );
};

export default CopilotDemo;