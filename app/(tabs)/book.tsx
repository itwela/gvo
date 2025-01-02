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
import { useEffect } from 'react';
import { fontSizes } from '@/constants/Fontsizes';
import sql from '@/helpers/neonClient';

export default function BookScreen() {
  const today = new Date(); // Get today's date
  const yesterday = new Date(); // Get yesterday's date
  yesterday.setDate(today.getDate() - 1); // Set yesterday's date

  const [startDate, setStartDate] = useState(today); // State to keep track of the start date
  const [daySelectedIndex, setDaySelectedIndex] = useState(-1); // State to keep track of the selected day index, -1 means no day is selected
  const [availibility, setAvailibility] = useState<any[]>([]); // State to keep track of room availability

  // Function to get all days of the current month starting from the given start date
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
  const daysOfMonth = getDaysOfMonth(startDate); // Get days of the current month
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]; // Array of month names

  // Function to handle arrow click for changing months
  const handleArrowClick = (direction: 'forward' | 'backward') => {
    const newStartDate = new Date(startDate);
    if (direction === 'forward') {
      newStartDate.setMonth(startDate.getMonth() + 1); // Move to the next month
      setDaySelectedIndex(-1); // Reset the selected day index
    } else {
      newStartDate.setMonth(startDate.getMonth() - 1); // Move to the previous month
      if (newStartDate < new Date(today.getFullYear(), today.getMonth(), 1)) {
        newStartDate.setMonth(today.getMonth()); // Prevent moving to a month before the current month
      }
      setDaySelectedIndex(-1); // Reset the selected day index
    }
    setStartDate(newStartDate); // Update the start date
  };

  // Function to handle day press
  const handleDayPress = (index: number) => {
    if (daySelectedIndex === index) {
      setDaySelectedIndex(-1); // Deselect the day if it's already selected
    } else {
      setDaySelectedIndex(index); // Select the day
      const selectedDay = daysOfMonth[index];
      if (selectedDay.getMonth() !== startDate.getMonth()) {
        setStartDate(selectedDay); // Update the start date if the selected day is in a different month
      }
    }
  };

  // Fetch room availability when the component mounts
  useEffect(() => {
    const fetchAvailibility = async () => {
      const result = await sql`SELECT * FROM room_availability`; // Fetch room availability from the database
      setAvailibility(result); // Update the availability state
      console.log("availibility", result); // Log the result
    };

    fetchAvailibility(); // Call the fetch function
  }, []);

  // Function to get availability for a specific day
  const getAvailabilityForDay = (day: Date) => {
    return availibility.filter(item => new Date(item.date).toDateString() === day.toDateString());
  };

  const rooms = [
    "", "A Room", "B Room", "C Room"
  ]

  return (
    <>
    <View style={{width: "100%", height: "100%", backgroundColor: gvoColors.dark, position: "absolute", zIndex: 1}}>
     </View>
    <SafeAreaView style={{width: "100%", position: "relative", zIndex: 2, backgroundColor: "transparent" }}>
      <ScrollView style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
        <View style={{padding: 20, width: "100%", backgroundColor: "transparent"}}>

          <Header/>

          <View style={styles.titleContainer}>
            <Text style={{ fontSize: fontSizes.large, fontWeight: 'bold', width: "80%" , color: gvoColors.dutchWhite}}>Studio TIme.</Text>
          </View>

          <View style={{marginTop: 30, width: "100%"}}>

              <View style={{display: "flex", marginBottom: 20, flexDirection: "column", justifyContent: "space-between", width: "100%"}}>
                <View style={{display: "flex", alignItems: "center", flexDirection: "row", gap: 3, width: "100%"}}>
                  <View style={{width: 15, height: 15, backgroundColor: gvoColors.azure, borderRadius: 100}}/>
                  <Text style={{color: gvoColors.dutchWhite, fontSize: fontSizes.small, fontWeight: 'bold',}}>= Studio Time Available</Text>
                </View>
              </View>

              <View style={{display: "flex", flexDirection: "row", alignItems: "center",  marginBottom: 20, justifyContent: "space-between", width: "100%"}}>
                
                {startDate.getMonth() === today.getMonth() && startDate.getFullYear() === today.getFullYear() ? (
                  <FontAwesome name="arrow-left" size={24} color={gvoColors.semidark} />
                ) : (
                  <TouchableOpacity onPress={() => handleArrowClick('backward')}>
                    <FontAwesome name="arrow-left" size={24} color={gvoColors.azure} />
                  </TouchableOpacity>
                )}

                <Text style={{color: gvoColors.dutchWhite, fontSize: fontSizes.medium, fontWeight: 'bold',}}>{months[startDate.getMonth()]} {startDate.getFullYear()}</Text>
                
                <TouchableOpacity onPress={() => handleArrowClick('forward')}>
                  <FontAwesome name="arrow-right" size={24} color={gvoColors.azure} />
                </TouchableOpacity>
              
              </View>

              <View style={{display: "flex" , justifyContent: "flex-start", flexDirection: "row", flexWrap: "wrap", alignSelf: "center"}} >

                {daysOfMonth.map((step, index) => {          
                  const isToday = step.toDateString() === today.toDateString(); // Check if the day is today
                  const isPast = step < yesterday; // Check if the day is in the past
                  const isSelected = daySelectedIndex === index; // Check if the day is selected
                  const hasAvailability = getAvailabilityForDay(step).length > 0; // Check if there is availability for the day
                  
                  return (
                    <TouchableOpacity 
                      activeOpacity={0.9} 
                      onPress={() => handleDayPress(index)} 
                      style={{
                        backgroundColor: isSelected ? gvoColors.azure : "transparent", 
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
                        color: isPast ? gvoColors.semidark : (isSelected ? "white" : gvoColors.dutchWhite) 
                      }}>
                        {step.getDate()}
                      </Text>
                      {isToday && <View style={{ borderRadius: 5, backgroundColor: gvoColors.maize, padding:2, width: 55, display: "flex", alignItems: "center", position: 'absolute', top:"-40%", left: "-5%", zIndex: 10}}><Text style={{fontWeight: "bold", fontSize: fontSizes.small}}>Today</Text></View>}
                      {hasAvailability && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: gvoColors.azure, position: 'absolute', top: 5, right: 5 }} />}
                    </TouchableOpacity>
                  );
                })}

              </View>

              <View style={{display: "flex", height: "100%", flexDirection: "column", gap: 20, paddingVertical: 20}}>
                {/* If a day is selected, show its availability */}
                {daySelectedIndex !== -1 && (
                  <>
                    {getAvailabilityForDay(daysOfMonth[daySelectedIndex]).length === 0 ? (
                      <Text style={[{fontSize: fontSizes.small, fontWeight: "bold", color: gvoColors.dutchWhite, textAlign: "center"}]}>No rooms available.</Text>
                    ) : (
                      getAvailabilityForDay(daysOfMonth[daySelectedIndex]).map((room, roomIndex) => (
                        <View key={roomIndex} style={styles.roomContainer}>
                          <View style={[styles.roomHeader, {backgroundColor: room?.room_id === 1 ? gvoColors.azure : room?.room_id === 2 ? gvoColors.maize : room?.room_id === 3 ? gvoColors.semidark : "transparent"}]}>
                            <Text style={[styles.roomText, {color: room?.room_id === 2 ? gvoColors.dark : gvoColors.dutchWhite}]}>{rooms[room?.room_id]}</Text>
                              <Text style={room.is_available ? styles.roomSubText : styles.roomSubTextZero}>
                                {room.is_available ? 'Available' : 'Not Available'}
                              </Text>
                          </View>
                          <View style={styles.sessionContainer}>
                            <View style={{width: "100%", display: "flex", flexDirection: "row", marginBottom: 10, justifyContent: "space-between"}}>
                              <Text style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Book while it's available:</Text>
                              <View style={{display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 50, backgroundColor: gvoColors.semidark,}}>
                                <Text style={{color: gvoColors.dark, fontWeight: "bold", fontSize: fontSizes.small}}>?</Text>
                              </View>
                            </View>
                            <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                              <View style={{width: "70%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                  <Text style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>Start Time</Text>
                                  <Text style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.medium - 6}}>{room.start_time.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                </View>
                                <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                  <Text style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>End Time</Text>
                                  <Text style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.medium - 6}}>{room.end_time.toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                </View>
                              </View>
                              <View style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <TouchableOpacity style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: gvoColors.azure, padding: 10, borderRadius: 6}}>
                                  <Text style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Book</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))
                    )}
                  </>
                )}

                {daySelectedIndex === -1 && (
                  <>
                  <View style={{width: "100%", alignItems: "center"}}>
                    <Text style={[{fontSize: fontSizes.small, fontWeight: "bold", color: gvoColors.dutchWhite, textAlign: "center"}]} >Select a day to see availability.</Text>
                  </View>
                  </>
                )}
              </View>

          </View>

        </View>
      </ScrollView>
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
    color: gvoColors.dutchWhite,
  },
  roomSubText: {
    fontSize: fontSizes.small,
    fontWeight: "bold",
    color: gvoColors.dutchWhite,
    padding: 5,
    backgroundColor: "green",
    borderRadius: 10,
    position: "absolute",
    right: 0,
    top: "-30%"
  },
  roomSubTextZero: {
    fontSize: fontSizes.small,
    fontWeight: "bold",
    color: gvoColors.azure,
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
    // borderWidth: 1,
    // borderColor: gvoColors.azure,
    backgroundColor: gvoColors.azure,
    borderRadius: 10,
    padding: 5,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  dayContainer: {
    marginBottom: 20,
  },
  sessionContainer: {
    borderWidth: 1,
    borderColor: gvoColors.semidark,
    borderRadius: 10,
    padding: 5,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10
  },
  dayText: {
    fontSize: fontSizes.medium,
    fontWeight: "bold",
    color: gvoColors.dutchWhite,
    marginBottom: 10,
  },
});
