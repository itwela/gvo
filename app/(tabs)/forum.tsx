import { Image, ScrollView, StyleSheet, RefreshControl, View, Platform, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Calendar, CalendarList } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gvoColors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import Header from '@/components/header';
import { fontSizes } from '@/constants/Fontsizes';
import { router } from 'expo-router';
import sql from '@/helpers/neonClient';
import FastImage from 'react-native-fast-image';
import CreatePostModal from '@/components/createPostModal';
import { useGVOContext } from '@/constants/gvoContext';
import Post from '@/components/post';
import { useUser } from '@clerk/clerk-expo';
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function ForumScreen() {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const createPost = async () => {
    const uid = "45531ae2-35cf-419d-b690-4a445401bcee"
    const repsonse = await sql`INSERT INTO posts (user_id, content) VALUES (${uid}, 'Hello World!')`;
    console.log(repsonse);
  }



  const [modalVisible, setModalVisible] = useState(false);
  const handleOpenModal = () => {
      setModalVisible(true);
  }
  const handleCloseModal = () => {
      setContentForm?.(null);
      setModalVisible(false);
  }

  const {threads, allThreads, setThreads, setAllThreads} = useGVOContext();
  const {sessions, setSessions} = useGVOContext();
  const [gvoUser, setGvoUser] = useState<any>();

  const rooms = [
    "", "A Room", "B Room", "C Room"
  ]
  const {contentForm, setContentForm, handleLike, handleUnlike, deletePost} = useGVOContext();
  const {likedPostId, setLikedPostId, wantsToAuthenticate, setWantsToAuthenticate} = useGVOContext();
  const {user} = useUser();  
  const uid = user?.id;


  const fetchUser = async () => {
    const userName = 'Twezo'
    const result = await sql`SELECT * FROM users WHERE clerk_id = ${uid}`;
    setGvoUser(result);
    console.log(result);
  };

  const fetchThreads = async () => {
    const result = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
    setThreads?.(result);
    console.log(result);
  };

  const fetchAllThreads = async () => {
    const result = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
    setAllThreads?.(result);
    console.log(result);
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
      console.log("Refreshing...");
    setRefreshing(true);
    fetchUser();
    fetchThreads();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    console.log("Refreshed!");
  };


  useEffect(() => {

    fetchUser();
    fetchAllThreads();

  }, []);

  // const checkPostLike = async () => {
  //   const result = await sql`SELECT * FROM post_likes WHERE user_id = ${uid} AND post_id = ${likedPostId}`;
  //   setIsPostLiked?.(result.length > 0);
  // };

  // useEffect(() => {
  //   checkPostLike();
  // }, [isPostLiked, likedPostId]);






  return (
    <>
    <View style={{width: "100%", height: "100%", backgroundColor: gvoColors.dark, position: "absolute", zIndex: 1}}>

    </View>
    <SafeAreaView style={{width: "100%", position: "relative", zIndex: 2, height: "100%", backgroundColor: "transparent" }}>
      <ScrollView refreshControl={<RefreshControl tintColor={gvoColors.azure} colors={[gvoColors.azure]} refreshing={refreshing} onRefresh={handleRefresh} />} style={{height: "100%", width: "100%", position: "relative", backgroundColor: "transparent"}}>
        <View style={{padding: 20, width: "100%", backgroundColor: "transparent"}}>

          <Header/>

          <View style={styles.titleContainer}>
            <Text allowFontScaling={false} style={{ fontSize: fontSizes.large - 6, color: gvoColors.dutchWhite, fontWeight: 'bold', width: "90%" }}>Connect with the community.</Text>
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={() => {router.push("/book")}} style={{marginVertical: 10, backgroundColor: gvoColors.azure, borderRadius: 10, padding: 10}}>
            <Text allowFontScaling={false} style={{ fontSize: fontSizes.small, textDecorationLine: "underline", fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>Want to book studio time? Click here.</Text>
          </TouchableOpacity>


        </View>
          {allThreads?.map((thread: any, index: number) => (
              <Post 
              id={thread?.id}
              clerk_id={thread?.clerk_id}
              image={thread?.user_img_url}
              username={thread?.username}
              created={thread?.created_at}
              content={thread?.content}
              likes={thread?.like_count}
              key={thread?.id}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              deletePost={deletePost}
              // key={thread?.id}
              // id={thread?.id}
              // title={thread?.title}
              // userImg={thread?.user_img_url}
              /> 
          ))}
      </ScrollView>
          <SignedIn>
            <View style={{height: 50, alignSelf: "flex-end", position: "absolute", zIndex: 3, bottom: "12%", display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
                <TouchableOpacity onPress={handleOpenModal} activeOpacity={0.9} style={{width: 50, borderRadius: 100, height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: gvoColors.maize}}>
                  <FontAwesome name='plus' size={25} color={gvoColors.azure} />
                </TouchableOpacity>
            </View>
          </SignedIn>
       
          <SignedOut>
            <View style={{height: 50, alignSelf: "flex-end", position: "absolute", zIndex: 3, bottom: "12%", display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
                <TouchableOpacity onPress={() => setWantsToAuthenticate?.(true)} activeOpacity={0.9} style={{width: 50, borderRadius: 100, height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: gvoColors.maize}}>
                  <FontAwesome name='plus' size={25} color={gvoColors.azure} />
                </TouchableOpacity>
            </View>
          </SignedOut>
          <CreatePostModal 
            visible={modalVisible}
            onClose={handleCloseModal}
            userImg={gvoUser?.[0]?.user_img_url}
            /> 
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
    opacity: 0
  },
  roomText: {
    fontSize: fontSizes.medium,
    fontWeight: "bold",
    color: gvoColors.dutchWhite
  },
  roomContainer: {
    borderRadius: 10,
    padding: 5,
    minHeight: 100,
  },
  roomHeader: {
    backgroundColor: gvoColors.emerald,
    borderRadius: 10,
    padding: 5,
  },
  thread: {
    width: "100%",
    height: 100,
    borderBottomWidth: 1,
    borderColor: gvoColors.semidark,
    marginBottom: 10
  },
  threadbox: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    gap: 20
  },
  personName: {
      fontSize: fontSizes.small + 1,
      fontWeight: "bold",
      color: gvoColors.azure
  },
  personText: {
      fontSize: fontSizes.small,
      color: gvoColors.dutchWhite
  },
  personImage: {
      width: 35,
      height: 35,
      borderRadius: 50
  },
  time: {
      fontSize: fontSizes.small,
      color: gvoColors.dutchWhite,
      opacity: 0.5
  }
});
