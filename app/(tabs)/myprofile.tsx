import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { gvoColors } from "@/constants/Colors";
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSizes } from "@/constants/Fontsizes";
import { FontAwesome } from "@expo/vector-icons";
import Header from '@/components/header';
import { useState } from "react";
import CreatePostModal from '@/components/createPostModal';
import { useEffect } from "react";
import sql from '@/helpers/neonClient';
import Post from "@/components/post";
import Session from "@/components/session";

export default function MyProfileScreen() {

    
    const [modalVisible, setModalVisible] = useState(false);
    const [postIsSelected, setPostIsSelected] = useState(true);
    const [sessionIsSelected, setSessionIsSelected] = useState(false);
    const handleOpenModal = () => {
        setModalVisible(true);
    }
    const handleCloseModal = () => {
        setModalVisible(false);
    }
    
    const [gvoUser, setGvoUser] = useState<any>();
    const [threads, setThreads] = useState<any>();
    const [session, setSession] = useState<any>();

    const fetchUser = async () => {
      const userName = 'Twezo'
      const result = await sql`SELECT * FROM users WHERE username = ${userName}`;
      setGvoUser(result);
      // console.log(result);
    };

    const fetchThreads = async () => {
      const result = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
      setThreads(result);
      // console.log(result);
    };

    const fetchSessions = async () => {
      const result = await sql`SELECT * FROM bookings`;
      setSession(result);
      console.log(result);
    };

    useEffect(() => {
      

  
      fetchUser();
      fetchThreads();
      fetchSessions();
  
    }, []);

    useEffect(() => {
      fetchThreads();
    }, [threads]);

    return (
        <>
            <View style={{width: "100%", height: "100%", backgroundColor: gvoColors.dark, position: "absolute", zIndex: 1}}>

            </View>
            <SafeAreaView style={{width: "100%", position: "relative", zIndex: 2, backgroundColor: "transparent" }}>
                <ScrollView style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>

                <View style={{ width: "100%",  height: 250, backgroundColor: "transparent"}}>
                    <View style={{width: "100%", padding: 20}}>
                    <Header/>
                    </View>
                    <View style={{position: "relative", zIndex: 2, padding: 20, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start"}}>
                        <View style={{display: "flex", width: "70%", flexDirection: "column"}}>
                            <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontSize: fontSizes.small + 6, fontWeight: "bold"}}>{gvoUser?.[0]?.name}</Text>
                            <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontSize: fontSizes.small,}}>{gvoUser?.[0]?.username}</Text>
                            <Text allowFontScaling={false} numberOfLines={5} style={{backgroundColor: "transparent", marginVertical: 10, width: "95%", color: gvoColors.dutchWhite, fontSize: fontSizes.small}}>
                                {gvoUser?.[0]?.bio}
                            </Text>
                        </View>
                        <View style={{display: "flex", width: "30%", backgroundColor: "transparent", alignItems: "flex-end",  flexDirection: "column"}}>
                            <View style={{width: 60, height: 60, borderRadius: 100, backgroundColor: gvoColors.maize}}></View>
                        </View>
                    </View>
                </View>

                <View style={{width: "100%", height: 25, backgroundColor: "transparent", display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                    <Text allowFontScaling={false} onPress={() => {setPostIsSelected(true); setSessionIsSelected(false)}} style={{color: postIsSelected ? gvoColors.azure : gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small + 6}}>Posts</Text>
                    <Text allowFontScaling={false} onPress={() => {setPostIsSelected(false); setSessionIsSelected(true)}} style={{color: sessionIsSelected ? gvoColors.azure : gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small + 6}}>Sessions</Text>
                </View>

                <View style={{width: "100%", height: 15, backgroundColor: "transparent", display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                    <View style={{width: "40%", borderBottomColor: postIsSelected ? gvoColors.azure : gvoColors.semidark, borderBottomWidth: 1}}/>
                    <View style={{width: "40%", borderBottomColor: sessionIsSelected ? gvoColors.azure : gvoColors.semidark, borderBottomWidth: 1}}/>
                </View>
                
                {postIsSelected === true && (
                    <>
                    <View>

                        {threads?.map((thread: any) => (
                            <Post 
                            id={thread?.id}
                            image={thread?.user_img_url}
                            username={thread?.username}
                            created={thread?.created_at}
                            content={thread?.content}
                            likes={thread?.like_count}
                            key={thread?.id}
                            // key={thread?.id}
                            // id={thread?.id}
                            // title={thread?.title}
                            // userImg={thread?.user_img_url}
                            />
                        ))}
                        </View>
                    </>
                )}

                {sessionIsSelected === true && (
                    <>
                        {session?.map((session: any, index: number) => (
                            <Session
                                status={session?.status}
                                theDate={new Date(session?.start_time).toLocaleString([], { year: 'numeric', month: "short", day: 'numeric' })}
                                startTime={new Date(session?.start_time).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                                endTime={new Date(session?.end_time).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                                roomid={session?.room_id}
                                key={session?.id}
                            />
                        ))}
                    </>
                )}

                </ScrollView>   
                <View style={{height: 50, alignSelf: "flex-end", position: "absolute", zIndex: 3, bottom: "12%", display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
                    <TouchableOpacity onPress={handleOpenModal} activeOpacity={0.9} style={{width: 50, borderRadius: 100, height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: gvoColors.maize}}>
                        <FontAwesome name='plus' size={25} color={gvoColors.azure} />
                    </TouchableOpacity>
                </View>
            <CreatePostModal 
              visible={modalVisible}
              onClose={handleCloseModal}
              userImg={gvoUser?.[0]?.user_img_url}
            /> 
            </SafeAreaView>


        </>
    );
}