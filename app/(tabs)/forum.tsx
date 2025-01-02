import { Image, ScrollView, StyleSheet, View, Platform, Text, TouchableOpacity } from 'react-native';
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

  const [threads, setThreads] = useState<any>();
  const [sessions, setSessions] = useState<any>();
  const [gvoUser, setGvoUser] = useState<any>();
  const rooms = [
    "", "A Room", "B Room", "C Room"
  ]
  const {contentForm, setContentForm} = useGVOContext();

  useEffect(() => {
    
    const fetchUser = async () => {
      const userName = 'Twezo'
      const result = await sql`SELECT * FROM users WHERE username = ${userName}`;
      setGvoUser(result);
      console.log(result);
    };

    const fetchThreads = async () => {
      const result = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
      setThreads(result);
      console.log(result);
    };

    const fetchSessions = async () => {
      const result = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
      setSessions(result);
      console.log(result);
    };

    fetchUser();
    fetchThreads();
    fetchSessions();

  }, []);


  return (
    <>
    <View style={{width: "100%", height: "100%", backgroundColor: gvoColors.dark, position: "absolute", zIndex: 1}}>

    </View>
    <SafeAreaView style={{width: "100%", position: "relative", zIndex: 2, height: "100%", backgroundColor: "transparent" }}>
      <ScrollView style={{height: "100%", width: "100%", position: "relative", backgroundColor: "transparent"}}>
        <View style={{padding: 20, width: "100%", backgroundColor: "transparent"}}>

          <Header/>

          <View style={styles.titleContainer}>
            <Text style={{ fontSize: fontSizes.large, color: gvoColors.dutchWhite, fontWeight: 'bold', width: "90%" }}>Connect with the community.</Text>
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={() => {router.push("/book")}} style={{marginVertical: 10, backgroundColor: gvoColors.azure, borderRadius: 10, padding: 10}}>
            <Text style={{ fontSize: fontSizes.small, textDecorationLine: "underline", fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>Want to book studio time? Click here.</Text>
          </TouchableOpacity>


        </View>
          {threads?.map((thread: any, index: number) => (
              <View key={index} style={styles.thread}>
                  <View style={styles.threadbox}>
                      <View style={{width: "10%", height: "100%",}}>
                          <View style={styles.personImage}>
                            <FastImage source={{ uri: thread.user_img_url }} style={{width: "100%", height: "100%", borderRadius: 100}} />
                          </View>
                      </View>
                      <View style={{width: "90%", height: "100%", display: "flex", flexDirection: "column"}}>
                          <View style={{display: "flex", flexDirection: "row", gap: 5}}>
                              <Text style={styles.personName}>{thread.username}</Text>
                              <Text style={styles.time}>
                                {(() => {
                                  const createdAt = new Date(thread.created_at);
                                  const now = new Date();
                                  const diffInMs = now.getTime() - createdAt.getTime();
                                  const diffInHours = Math.floor(Math.abs(diffInMs) / (1000 * 60 * 60));

                                  if (diffInHours >= 24) {
                                    const diffInDays = Math.floor(diffInHours / 24);
                                    return `${diffInDays}d ago`;
                                  } else {
                                    return `${diffInHours}h ago`;
                                  }
                                })()}
                              </Text>
                          </View>
                          <Text style={styles.personText}>{thread.content}</Text>
                          <View style={{display: "flex", flexDirection: "row", paddingVertical: 10}}>
                              <FontAwesome name='heart-o' size={15} color={gvoColors.dutchWhite} style={{marginRight: 5}}/>
                              <Text style={{color: gvoColors.dutchWhite}}>{thread.like_count}</Text>
                          </View>
                      </View>
                  </View>
              </View>  
          ))}
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
