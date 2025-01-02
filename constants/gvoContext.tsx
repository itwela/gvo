import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GVOContextType {
    currentRouteName?: string;
    setCurrentRouteName?: (value: string) => void;
    contentForm?: any,
    setContentForm?: (value: any) => void;
}  

const GVOContext = createContext<GVOContextType | null>(null);

export const GVOProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentRouteName, setCurrentRouteName] = useState<string>('');
    const [contentForm, setContentForm] = useState<any>();
    return (
        <>
            <GVOContext.Provider value={{
                currentRouteName,
                setCurrentRouteName,
                contentForm,
                setContentForm
            }}>
                {children}
            </GVOContext.Provider>
        </>
    );
};

export const useGVOContext = () => {
    const context = useContext(GVOContext);
    if (!context) {
        throw new Error('useGVOContext must be used within a GVOProvider');
    }
    return context;
};
