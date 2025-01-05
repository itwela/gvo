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
import { useUser } from "@clerk/clerk-expo";
import FastImage from "react-native-fast-image";
import { router } from "expo-router";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { SettingsModal } from "@/components/settingsModal";
import { useGVOContext } from "@/constants/gvoContext";

export default function MyProfileScreen() {

    
    const [modalVisible, setModalVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [postIsSelected, setPostIsSelected] = useState(true);
    const [sessionIsSelected, setSessionIsSelected] = useState(false);
    const { gvoUserName, setWantsToAuthenticate } = useGVOContext();


    const handleOpenModal = () => {
        setModalVisible(true);
    }
    const handleCloseModal = () => {
        setModalVisible(false);
    }

    const handleOpenSettings = () => {
        setSettingsVisible(true);
    }
    const handleCloseSettings = () => {
        setSettingsVisible(false);
    }
    
    const [gvoUser, setGvoUser] = useState<any>();
    const [threads, setThreads] = useState<any>();
    const [session, setSession] = useState<any>();
    const {user} = useUser();

    const fetchUser = async () => {
      const userName = 'Twezo'
      const result = await sql`SELECT * FROM users WHERE clerk_id = ${user?.id}`;
      setGvoUser(result);
      // console.log(result);
    };

    const fetchThreads = async () => {
      const result = await sql`SELECT * FROM posts WHERE clerk_id = ${user?.id} ORDER BY created_at DESC`;
      setThreads(result);
      console.log("thethreads", result);
    };

    const fetchSessions = async () => {
      const result = await sql`SELECT * FROM bookings WHERE clerk_id = ${gvoUser?.id} ORDER BY created_at DESC`;
      setSession(result);
    };

    useEffect(() => {
      
    // if (user) {
      fetchUser();
      fetchThreads();
      fetchSessions();
    // }
      
    }, []);


    return (
        <>
            <View style={{width: "100%", height: "100%", backgroundColor: gvoColors.dark, position: "absolute", zIndex: 1}}>

            </View>
            <SafeAreaView style={{width: "100%", position: "relative", zIndex: 2, backgroundColor: "transparent" }}>
                
                <SignedIn>


                <ScrollView style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>

                <View style={{ width: "100%",  height: 250, backgroundColor: "transparent"}}>
                    <View style={{width: "100%", padding: 20}}>
                        <Header/>
                    </View>
                    <View style={{position: "relative", zIndex: 2, padding: 20, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start"}}>
                        <View style={{display: "flex", width: "70%", flexDirection: "column"}}>
                            <Text allowFontScaling={false} style={{color: gvoColors.azure, fontSize: fontSizes.small + 6, fontWeight: "bold"}}>{gvoUser?.[0]?.name}</Text>
                            <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontSize: fontSizes.small,}}>{gvoUser?.[0]?.username}</Text>
                            <Text allowFontScaling={false} numberOfLines={5} style={{backgroundColor: "transparent", marginVertical: 10, width: "95%", color: gvoColors.dutchWhite, fontSize: fontSizes.small}}>
                                {gvoUser?.[0]?.bio}
                            </Text>
                        </View>
                        <View style={{display: "flex", width: "30%", backgroundColor: "transparent", alignItems: "flex-end",  flexDirection: "column"}}>
                            {/* <View style={{width: 60, height: 60, borderRadius: 100, backgroundColor: gvoColors.maize}}></View> */}
                            <FastImage source={{uri: gvoUser?.[0]?.user_img_url}} style={{width: 60, height: 60, borderRadius: 100}}/>
                        </View>
                    </View>
                    <View style={{position: "relative", width: "100%", zIndex: 2, paddingHorizontal: 20, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                       <TouchableOpacity onPress={() => {handleOpenSettings()}} activeOpacity={0.9} style={{padding: 5, width: "25%", alignItems: "center", backgroundColor: gvoColors.semidark, borderRadius: 10, paddingHorizontal: 10}}>
                            <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontSize: fontSizes.small, fontWeight: "bold"}}>Settings</Text>
                       </TouchableOpacity>
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
                            clerk_id={thread?.clerk_id}
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

                        {threads?.length === 0 && (
                            <View style={{width: "100%", padding: 20}}>
                                <Text allowFontScaling={false} style={{ fontSize: fontSizes.small, fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>Join the GVO community!</Text>
                                <Text allowFontScaling={false} style={{ marginTop: 10, fontSize: fontSizes.small, fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>Press the yellow button below to post something!</Text>
                            </View>
                        )}

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

                        {session === undefined && (
                            <View style={{width: "100%", padding: 20}}>
                                <Text allowFontScaling={false} style={{ fontSize: fontSizes.small, fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>You haven't booked a session with us just yet!</Text>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => {router.push("/book")}} style={{marginVertical: 10, backgroundColor: gvoColors.azure, borderRadius: 10, padding: 10}}>
                            <Text allowFontScaling={false} style={{ fontSize: fontSizes.small, textDecorationLine: "underline", fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>Want to book studio time? Click here.</Text>
                        </TouchableOpacity>
                            </View>
                        )}

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

                <SettingsModal
                visible={settingsVisible}
                onClose={handleCloseSettings}
                />

                </SignedIn>

                <SignedOut>


                    <ScrollView style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>

                    <View style={{ width: "100%",  height: 250, backgroundColor: "transparent"}}>
                        <View style={{width: "100%", padding: 20}}>
                            <Header/>
                        </View>
                    </View>

                    <View style={{width: "100%", padding: 20, alignItems: "center", backgroundColor: "transparent"}}>
                        <Text allowFontScaling={false} style={{ fontSize: fontSizes.medium, fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>You don't have a GVO Studios account yet.</Text>
                        <TouchableOpacity activeOpacity={0.9} onPress={() => {setWantsToAuthenticate?.(true);}} style={{marginVertical: 10, width: "70%", backgroundColor: gvoColors.azure, borderRadius: 10, padding: 10}}>
                            <Text allowFontScaling={false} style={{ fontSize: fontSizes.small, fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>Get started</Text>
                        </TouchableOpacity>
                    </View>

                    </ScrollView>   
   
                </SignedOut>

            </SafeAreaView>


        </>
    );
}