import { useState } from 'react';

export const useGenerateTask = () => {
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const handleChange = (value: string[]) => {
        setSelectedKeywords(value);
        setIsSelectOpen(false);
    };

    const handleOpenChange = (visible: boolean) => {
        setIsSelectOpen(visible);
    };

    return {
        selectedKeywords,
        isSelectOpen,
        handleChange,
        handleOpenChange,
    };
};