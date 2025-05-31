// features/tasks/model/useKeywordsFilter.ts
import { useState } from 'react';

export const useKeywordsFilter = (initialKeywords: string[] = []) => {
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>(initialKeywords);
    const [isKeywordsOpen, setIsKeywordsOpen] = useState(false);

    const handleKeywordsChange = (value: string[]) => {
        setSelectedKeywords(value);
        setIsKeywordsOpen(false);
    };

    const toggleKeywordsDropdown = (visible: boolean) => {
        setIsKeywordsOpen(visible);
    };

    return {
        selectedKeywords,
        isKeywordsOpen,
        handleKeywordsChange,
        toggleKeywordsDropdown,
    };
};