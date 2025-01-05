import { Image, ScrollView, StyleSheet, View,  Platform, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

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
import { useEffect } from 'react';
import FastImage from 'react-native-fast-image';
import { FaqModal } from '@/components/faqModal';
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const [modalVisible, setModalVisible] = useState(false);
  const handleOpenModal = () => {
      setModalVisible(true);
  }
  const handleCloseModal = () => {
      setModalVisible(false);
  }

  return (
    <>
    <View style={{width: "100%", height: "100%", backgroundColor: gvoColors.dark, position: "absolute", zIndex: 1}}>

    </View>
    <SafeAreaView style={{width: "100%", position: "relative", zIndex: 2, backgroundColor: "transparent" }}>
      <ScrollView style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
        <View style={{padding: 20, width: "100%", backgroundColor: "transparent"}}>

          <Header/>

          <View style={styles.titleContainer}>
            <Text allowFontScaling={false} style={{ fontSize: fontSizes.large, color: gvoColors.dutchWhite, fontWeight: 'bold', width: "80%" }}>Welcome to GVO Studios.</Text>
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={() => {router.push("/book")}} style={{marginVertical: 10, backgroundColor: gvoColors.azure, borderRadius: 10, padding: 10}}>
            <Text allowFontScaling={false} style={{ fontSize: fontSizes.small, textDecorationLine: "underline", fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>Want to book studio time? Click here.</Text>
          </TouchableOpacity>

          <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <View style={{width: "48%"}}>
              <View style={{width: "100%", height: 250, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10, backgroundColor: "transparent", borderRadius: 10}}>
                
                <TouchableOpacity activeOpacity={0.9} onPress={handleOpenModal} style={{width: "100%", height: 40, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, backgroundColor: gvoColors.semidark, borderRadius: 10}}>
                  <Text allowFontScaling={false} style={styles.headlinetext}>FAQ</Text>
                  <FontAwesome name="angle-right" style={{fontWeight: "bold"}} size={24} color={gvoColors.dutchWhite} />
                </TouchableOpacity>
               
                <View style={{width: "100%", height: 200, backgroundColor: gvoColors.semidark, borderRadius: 10}}>
                  <FastImage source={{uri: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1200"}} style={{width: "100%", height: "100%", borderRadius: 10}} />
                </View>

              </View>
            </View>
            <View style={{width: "48%"}}>
              <View style={{width: "100%", height: 250, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10, backgroundColor: "transparent", borderRadius: 10}}>
              
                <View style={{width: "100%", height: 160, backgroundColor: gvoColors.semidark, borderRadius: 10}}>
                  <FastImage source={{uri: "https://images.pexels.com/photos/744322/pexels-photo-744322.jpeg?auto=compress&cs=tinysrgb&w=1200"}} style={{width: "100%", height: "100%", borderRadius: 10}} />
                </View>

                <View style={{width: "100%", height: 80, justifyContent: "flex-end", backgroundColor: gvoColors.semidark, borderRadius: 10}}>

                <View style={{width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: gvoColors.semidark, borderRadius: 10}}>
                  <Text allowFontScaling={false} style={styles.headlinetext}>Events</Text>
                  <FontAwesome name="angle-right" style={{fontWeight: "bold"}} size={24} color={gvoColors.dutchWhite} />
                </View>

                </View>

              </View>
            </View>
          </View>

          <View style={{width: "100%", display: "flex", justifyContent: "flex-end", height: 240, marginVertical: 10, backgroundColor: "transparent", borderRadius: 10}}>
                  <FastImage source={{uri: "https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&w=1200"}} style={{width: "100%", height: "100%", position: "absolute",zIndex: -1, bottom: 0, borderRadius: 10}} />

              <View style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "transparent", borderRadius: 10}}>
                  <Text allowFontScaling={false} style={[styles.headlinetext, {backgroundColor: gvoColors.dark, paddingHorizontal: 15, borderRadius: 10}]}>Good Vibes Only.</Text>
                  {/* <FontAwesome name="anxgle-right" style={{fontWeight: "bold"}} size={24} color={gvoColors.dutchWhite} /> */}
                </View>


          </View>

        </View>
      </ScrollView>
      <FaqModal 
            visible={modalVisible}
            onClose={handleCloseModal}
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
  headlinetext: {
    fontSize: fontSizes.small + 10,
    fontWeight: "bold",
    color: gvoColors.dutchWhite
  }

});
