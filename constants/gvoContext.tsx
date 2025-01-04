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
    threads?: any;
    setThreads?: (value: any) => void;
    allThreads?: any;
    setAllThreads?: (value: any) => void;
    sessions?: any;
    setSessions?: (value: any) => void;
    likedPosts?: any;
    setLikedPosts?: (value: any) => void
    likedPostId?: any;
    setLikedPostId?: (value: any) => void
    gvoUserName?: string;
    setGvoUserName?: (value: string) => void
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
    const [threads, setThreads] = useState<any>();
    const [sessions, setSessions] = useState<any>();
    const [allThreads, setAllThreads] = useState<any>();
    const [likedPosts, setLikedPosts] = useState<any>();
    const [likedPostId, setLikedPostId] = useState<any>();
    const [gvoUserName, setGvoUserName] = useState<string>('');
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
                setDaySelectedIndex,
                threads,
                setThreads,
                allThreads,
                setAllThreads,
                sessions,
                setSessions,
                likedPosts,
                setLikedPosts,
                likedPostId,
                setLikedPostId,
                gvoUserName,    
                setGvoUserName
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
