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

export default function BookScreen() {
  const today = new Date();
  const yesterday = new Date();
  const available = [2,4,0]
  yesterday.setDate(today.getDate() - 1);

  const [startDate, setStartDate] = useState(today);
  const [daySelectedIndex, setDaySelectedIndex] = useState(-1); // Initialize with -1 to indicate no day is selected
  // write a function that returns the days of the current month, starting from the given start date
  function getDaysOfMonth(start: Date) {
    const days = [];
    const year = start.getFullYear();
    const month = start.getMonth();
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
  const daysOfMonth = getDaysOfMonth(startDate);
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  const handleArrowClick = (direction: 'forward' | 'backward') => {
    const newStartDate = new Date(startDate);
    if (direction === 'forward') {
      newStartDate.setMonth(startDate.getMonth() + 1);
      setDaySelectedIndex(-1); // Reset the selected day index
    } else {
      newStartDate.setMonth(startDate.getMonth() - 1);
      if (newStartDate < today) {
        newStartDate.setMonth(today.getMonth());
      }
      setDaySelectedIndex(-1); // Reset the selected day index
    }
    setStartDate(newStartDate);
  };

  const handleDayPress = (index: number) => {
    if (daySelectedIndex === index) {
      setDaySelectedIndex(-1); // Deselect the day if it's already selected
    } else {
      setDaySelectedIndex(index);
      const selectedDay = daysOfMonth[index];
      if (selectedDay.getMonth() !== startDate.getMonth()) {
        setStartDate(selectedDay);
      }
    }
  };

  return (
    <SafeAreaView style={{width: "100%"}}>
      <ScrollView style={{height: "100%", width: "100%"}}>
        <View style={{padding: 20, width: "100%"}}>

          <Header/>

          <View style={styles.titleContainer}>
            <Text style={{ fontSize: fontSizes.large, fontWeight: 'bold', width: "80%" }}>Studio TIme.</Text>
          </View>

          <View style={{marginTop: 30, width: "100%"}}>

              <View style={{display: "flex", flexDirection: "row", alignItems: "center",  marginBottom: 20, justifyContent: "space-between", width: "100%"}}>
                
                {daySelectedIndex === -1 && (
                  <>
                <TouchableOpacity onPress={() => handleArrowClick('backward')}>
                  <FontAwesome name="arrow-left" size={24} color={gvoColors.emerald} />
                </TouchableOpacity>
                  </>
                )}

                {daySelectedIndex != -1 && (
                  <>
                  <View></View>
                  </>
                )}
                
                <Text style={{color: "black", fontSize: fontSizes.medium, fontWeight: 'bold'}}>{months[startDate.getMonth()]} {startDate.getFullYear()}</Text>
                
                {daySelectedIndex != -1 && (
                  <>
                  <View></View>
                  </>
                )}

                {daySelectedIndex === -1 && (
                  <>
                <TouchableOpacity onPress={() => handleArrowClick('forward')}>
                  <FontAwesome name="arrow-right" size={24} color={gvoColors.emerald} />
                </TouchableOpacity>
                  </>
                )}
              
              </View>

              <View style={{display: "flex" , justifyContent: "flex-start", flexDirection: "row", flexWrap: "wrap", alignSelf: "center"}} >

                {daysOfMonth.map((step, index) => {          
                  const isToday = step.toDateString() === today.toDateString();
                  const isPast = step < yesterday;
                  const isSelected = daySelectedIndex === index;
                  return (
                    <TouchableOpacity 
                      activeOpacity={0.9} 
                      onPress={() => handleDayPress(index)} 
                      style={{
                        backgroundColor: isSelected ? gvoColors.emerald : "transparent", 
                        position: "relative", 
                        width: 50, 
                        height: 50, 
                        alignItems: "center", 
                        justifyContent: "center", 
                        borderRadius: 6, 
                        padding: 4,
                        display: daySelectedIndex === -1 || isSelected ? "flex" : "none" // Hide other days if a day is selected
                      }} 
                      key={index} 
                      disabled={isPast} // Disable past days
                    >
                      <Text style={{ 
                        fontSize: fontSizes.medium, 
                        fontWeight: 'bold', 
                        color: isPast ? gvoColors.lightText : (isSelected ? gvoColors.dutchWhite : "black") 
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
                        <Text style={styles.roomSubText}>{available[0]} slot(s) available</Text>
                      </View>
                  </View>

                  <View style={styles.roomContainer}>
                    <View style={styles.roomHeader}>
                      <Text style={styles.roomText}>B room</Text>
                      <Text style={styles.roomSubText}>{available[1]} slot(s) available</Text>
                    </View>
                  </View>

                  <View style={styles.roomContainer}>
                    <View style={styles.roomHeader}>
                      <Text style={[styles.roomText]}>C room</Text>
                      <Text style={styles.roomSubTextZero}>{available[2]} slot(s) available</Text>
                    </View>
                  </View>

              </View>

          </View>

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
    color: gvoColors.emerald
  },
  roomSubText: {
    fontSize: fontSizes.small,
    fontWeight: "bold",
    color: gvoColors.dutchWhite,
    padding: 5,
    backgroundColor: gvoColors.dustyOrange,
    borderRadius: 10,
    position: "absolute",
    right: 0,
    top: "-30%"
  },
  roomSubTextZero: {
    fontSize: fontSizes.small,
    fontWeight: "bold",
    color: gvoColors.emerald,
    padding: 5,
    backgroundColor: "white",
    borderRadius: 10,
    position: "absolute",
    right: 0,
    top: "-30%"
  },
  roomContainer: {
    borderRadius: 10,
    padding: 5,
    minHeight: 100,
  },
  roomHeader: {
    borderWidth: 1,
    borderColor: gvoColors.emerald,
    borderRadius: 10,
    padding: 5,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },

});
