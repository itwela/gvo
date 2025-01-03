import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GVOContextType {
    currentRouteName?: string;
    setCurrentRouteName?: (value: string) => void;
    contentForm?: any,
    setContentForm?: (value: any) => void;
    wantsToLogIn?: boolean
    setWantsToLogIn?: (value: boolean) => void
    wantsToSignUp?: boolean
    setWantsToSignUp?: (value: boolean) => void
    wantsToLogOut?: boolean
    setWantsToLogOut?: (value: boolean) => void
    wantsToAuthenticate?: boolean
    setWantsToAuthenticate?: (value: boolean) => void
    userStartTime?: any;
    setUserStartTime?: (value: any) => void;
    adminStartTime?: any;
    setAdminStartTime?: (value: any) => void;
    adminEndTime?: any;
    setAdminEndTime?: (value: any) => void;
    daySelectedIndex?: number;
    setDaySelectedIndex?: (value: number) => void;
}  

const GVOContext = createContext<GVOContextType | null>(null);

export const GVOProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentRouteName, setCurrentRouteName] = useState<string>('');
    const [contentForm, setContentForm] = useState<any>();
    const [wantsToAuthenticate, setWantsToAuthenticate] = useState<boolean>(false);
    const [wantsToLogIn, setWantsToLogIn] = useState<boolean>(false);
    const [wantsToSignUp, setWantsToSignUp] = useState<boolean>(true);
    const [wantsToLogOut, setWantsToLogOut] = useState<boolean>(false);
    const [userStartTime, setUserStartTime] = useState<any>();
    const [adminStartTime, setAdminStartTime] = useState<any>();
    const [adminEndTime, setAdminEndTime] = useState<any>();
    const [daySelectedIndex, setDaySelectedIndex] = useState<number>(-1);
    return (
        <>
            <GVOContext.Provider value={{
                currentRouteName,
                setCurrentRouteName,
                contentForm,
                setContentForm,
                wantsToAuthenticate,
                setWantsToAuthenticate,
                wantsToLogIn,
                setWantsToLogIn,
                wantsToSignUp,
                setWantsToSignUp,
                wantsToLogOut,
                setWantsToLogOut,
                userStartTime,
                setUserStartTime,
                adminStartTime,
                setAdminStartTime,
                adminEndTime,
                setAdminEndTime,
                daySelectedIndex,
                setDaySelectedIndex
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
