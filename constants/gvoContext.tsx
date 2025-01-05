import React, { createContext, useContext, useState, ReactNode } from 'react';
import sql from '@/helpers/neonClient'; // Assuming sql is imported from this path

interface GVOContextType {
    currentRouteName?: string;
    setCurrentRouteName?: (value: string) => void;
    contentForm?: any;
    setContentForm?: (value: any) => void;
    wantsToLogIn?: boolean;
    setWantsToLogIn?: (value: boolean) => void;
    wantsToSignUp?: boolean;
    setWantsToSignUp?: (value: boolean) => void;
    wantsToLogOut?: boolean;
    setWantsToLogOut?: (value: boolean) => void;
    wantsToAuthenticate?: boolean;
    setWantsToAuthenticate?: (value: boolean) => void;
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
    setLikedPosts?: (value: any) => void;
    likedPostId?: any;
    setLikedPostId?: (value: any) => void;
    gvoUser?: any;
    setGvoUser?: (value: any) => void;
    gvoUserName?: string;
    setGvoUserName?: (value: string) => void;
    handleLike?: (userId: string, postId: string) => Promise<void>;
    handleUnlike?: (userId: string, postId: string) => Promise<void>;
    deletePost?: (postId: string) => Promise<void>;
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
    const [threads, setThreads] = useState<any>([]);
    const [sessions, setSessions] = useState<any>();
    const [allThreads, setAllThreads] = useState<any>([]);
    const [likedPosts, setLikedPosts] = useState<any>();
    const [likedPostId, setLikedPostId] = useState<any>();
    const [gvoUser, setGvoUser] = useState<any>();
    const [gvoUserName, setGvoUserName] = useState<string>('');
    const handleLike = async (userid: string, postId: string) => {
        console.log("Starting context handleLike function");
        await sql`UPDATE posts SET like_count = like_count + 1 WHERE id = ${postId} AND clerk_id = ${userid}`;

        setThreads((prev: any) =>
            prev.map((thread: any) =>
                thread.id === postId ? { ...thread, like_count: thread.like_count + 1 } : thread
            )
        );

        setAllThreads((prev: any) =>
            prev.map((thread: any) =>
                thread.id === postId ? { ...thread, like_count: thread.like_count + 1 } : thread
            )
        );

        setLikedPosts((prev: any) => {
            if (!prev) prev = {};
            return {
                ...prev,
                [postId]: { liked: true, like_count: (prev[postId]?.like_count || 0) + 1 }
            };
        });

        console.log("Finished context handleLike function");
    };
    const handleUnlike = async (userid: string, postId: string) => {
        console.log("Starting context handleUnlike function");
        await sql`UPDATE posts SET like_count = like_count - 1 WHERE id = ${postId} AND clerk_id = ${userid}`;

        setThreads((prev: any) =>
            prev.map((thread: any) =>
                thread.id === postId ? { ...thread, like_count: thread.like_count - 1 } : thread
            )
        );

        setAllThreads((prev: any) =>
            prev.map((thread: any) =>
                thread.id === postId ? { ...thread, like_count: thread.like_count - 1 } : thread
            )
        );

        setLikedPosts((prev: any) => {
            const currentLikeCount = prev?.[postId]?.like_count || 0;
            return {
                ...prev,
                [postId]: { liked: false, like_count: currentLikeCount - 1 }
            };
        });
        
        console.log("Finished context handleUnlike function");
    };
    const deletePost = async (id: string) => {
        console.log("Starting context deletePost function");
        console.log(id);
        try {
            await sql`DELETE FROM posts WHERE id = ${id}`;
        } catch (error) {
            console.error("Error deleting post:", error);
        }
        setThreads((prev: any) => prev.filter((thread: any) => thread.id !== id));
        setAllThreads((prev: any) => prev.filter((thread: any) => thread.id !== id));
        console.log("Finished context deletePost function");
    };

    return (
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
            gvoUser,
            setGvoUser,
            gvoUserName,
            setGvoUserName,
            handleLike,
            handleUnlike,
            deletePost
        }}>
            {children}
        </GVOContext.Provider>
    );
};

export const useGVOContext = () => {
    const context = useContext(GVOContext);
    if (!context) {
        throw new Error('useGVOContext must be used within a GVOProvider');
    }
    return context;
};
