import { useState } from 'react';
import ChatSidebar from "./sidebar/ChatSidebar.tsx";
import { useChatBoxStyle } from "./styles/useChatBoxStyle.ts";
import EntryPanel from './workarea/EntryPanel/ui/EntryPanel.tsx';

const ChatBox = () => {
    const { styles: workareaStyles } = useChatBoxStyle();

    const [openSidebar, setOpenSidebar] = useState(true);

    return (
        <div className={workareaStyles.wrapper}>
            {/** Левая рабочая зона */}
            <div className={workareaStyles.workarea}>
                <div className={workareaStyles.workareaHeader}>
                    <div className={workareaStyles.headerTitle}>
                        Roseltorg
                    </div>

                    {!openSidebar && (
                        <div onClick={() => setOpenSidebar(true)} className={workareaStyles.headerButton}>
                            ✨ Открыть
                        </div>
                    )}
                </div>

                <div className={workareaStyles.workareaBody}>
                    <div className={workareaStyles.bodyContent}>
                        <EntryPanel />
                    </div>
                </div>
            </div>

            {/** Правая диалоговая область */}
            <ChatSidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        </div>
    );
};

export default ChatBox;