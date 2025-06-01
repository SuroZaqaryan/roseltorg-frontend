import { useState } from 'react';
import Copilot  from "./copilot/copilot.tsx";
import {useWorkareaStyle} from "./styles/useWorkareaStyle.ts";
import { Prompt } from './prompts/prompt';

const CopilotDemo = () => {
    const { styles: workareaStyles } = useWorkareaStyle();

    // ==================== State =================
    const [copilotOpen, setCopilotOpen] = useState(true);

    // ==================== Render =================
    return (
        <div className={workareaStyles.copilotWrapper}>
            {/** 左侧工作区 */}
            <div className={workareaStyles.workarea}>
                <div className={workareaStyles.workareaHeader}>
                    <div className={workareaStyles.headerTitle}>
                        <img
                            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
                            draggable={false}
                            alt="logo"
                            width={20}
                            height={20}
                        />
                        OMI Chatbot
                    </div>
                    {!copilotOpen && (
                        <div onClick={() => setCopilotOpen(true)} className={workareaStyles.headerButton}>
                            ✨ AI Copilot
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