import { Image, ScrollView, StyleSheet, View, Platform, Text, TouchableOpacity } from 'react-native';
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

export default function HomeScreen() {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return (
    <SafeAreaView style={{width: "100%"}}>
      <ScrollView style={{height: "100%", width: "100%"}}>
        <View style={{padding: 20, width: "100%"}}>

          <Header/>

          <View style={styles.titleContainer}>
            <Text style={{ fontSize: fontSizes.large, fontWeight: 'bold', width: "80%" }}>Welcome to GVO Studios.</Text>
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={() => {router.push("/book")}} style={{marginVertical: 10, backgroundColor: gvoColors.dustyOrange, borderRadius: 10, padding: 10}}>
            <Text style={{ fontSize: fontSizes.small, textDecorationLine: "underline", fontWeight: 'bold', color: gvoColors.dutchWhite, textAlign: "center"}}>Want to book studio time? Click here.</Text>
          </TouchableOpacity>

          {/* <View style={{marginTop: 50, width: "100%"}}>

          <View style={{display: "flex", flexDirection: "row", alignItems: "center",  marginBottom: 20, justifyContent: "space-between", width: "100%"}}>
            <TouchableOpacity onPress={() => handleArrowClick('backward')}>
              <FontAwesome name="arrow-left" size={24} color={gvoColors.emerald} />
            </TouchableOpacity>
            <Text style={{color: "black", fontSize: fontSizes.medium, fontWeight: 'bold'}}>{months[startDate.getMonth()]}</Text>
            <TouchableOpacity onPress={() => handleArrowClick('forward')}>
              <FontAwesome name="arrow-right" size={24} color={gvoColors.emerald} />
            </TouchableOpacity>
          </View>

              <View style={{display: "flex" , justifyContent: "space-between", flexDirection: "row", width: "100%"}} >

                {nextFiveDays.map((step, index) => {          
                  const isToday = step.toDateString() === today.toDateString();
                  const isPast = step < yesterday;
                  return (
                    <TouchableOpacity 
                      activeOpacity={0.9} 
                      onPress={() => handleDayPress(index)} 
                      style={{
                        backgroundColor: daySelectedIndex === index ? gvoColors.emerald : "transparent", 
                        position: "relative", 
                        width: 50, 
                        height: 50, 
                        alignItems: "center", 
                        justifyContent: "center", 
                        borderRadius: 6, 
                        padding: 2
                      }} 
                      key={index} 
                      disabled={isPast} // Disable past days
                    >
                      <Text style={{ 
                        fontSize: fontSizes.medium, 
                        fontWeight: 'bold', 
                        color: isPast ? gvoColors.lightText : (daySelectedIndex === index ? gvoColors.dutchWhite : "black") 
                      }}>
                        {step.getDate()}
                      </Text>
                      {isToday && <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: gvoColors.earthyellow, position: 'absolute', top: 5, left: 0, zIndex: 10}} />}
                    </TouchableOpacity>
                  );
                })}

              </View>

              <View style={{display: "flex", height: "100%", flexDirection: "column", gap: 20, paddingVertical: 20}}>
                  
                  <View style={styles.roomContainer}>
                      <View style={styles.roomHeader}>
                        <Text style={styles.roomText}>A room</Text>
                      </View>
                  </View>

                  <View style={styles.roomContainer}>
                    <View style={styles.roomHeader}>
                      <Text style={styles.roomText}>B room</Text>
                    </View>
                  </View>

                  <View style={styles.roomContainer}>
                    <View style={styles.roomHeader}>
                      <Text style={[styles.roomText]}>C room</Text>
                    </View>
                  </View>

              </View>

          </View> */}

        </View>
      </ScrollView>
    </SafeAreaView>
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

});
