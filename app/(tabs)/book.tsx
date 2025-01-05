import { Image, ScrollView, Modal, RefreshControl, FlatList, StyleSheet, View, Platform, Text, TouchableOpacity, Switch } from 'react-native';
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
import { useGVOContext } from '@/constants/gvoContext';
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";

const StartSelector = ({ availableTimes, roomId }: { availableTimes?: Array<{ id: any, start_time: string; end_time: string; room_id: number }>, roomId: number }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimeLocal, setSelectedTimeLocal] = useState<string | null>(null);

  if (!availableTimes) {
    console.error("No valid availability data provided.");
    return null;
  }

  // Filter available times by the room index
  availableTimes = availableTimes.filter(time => time.room_id === roomId);
  console.log("availableTimescfiltered", availableTimes);

  const handleTime = (item: any) => {
    setSelectedTimeLocal(item.start_time);
    setSelectedTime(item.start_time);
    setModalVisible(false);
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <View style={{ width: '100%', alignItems: 'center', position: 'relative' }}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ paddingVertical: 10 }}>
        <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
          {selectedTime ? formatTime(selectedTime) : "See Times"}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '60%', alignSelf: 'center', borderRadius: 10, paddingTop: 10, height: 200, backgroundColor: 'black' }}>
            <FlatList
              data={availableTimes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleTime(item)}
                  style={{ padding: 10, backgroundColor: 'gray' }}
                >
                  <Text allowFontScaling={false} style={{ fontSize: 16, color: 'white' }}>
                    {formatTime(item.start_time)}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 10, width: '100%', alignItems: 'flex-end' }}>
              <Text allowFontScaling={false} style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const StartSelectorAdmin = (availableTimes?: any) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { adminStartTime, setAdminStartTime } = useGVOContext();

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const midnightLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    for (let i = 0; i < 24; i++) {
      const localTime = new Date(midnightLocal.getTime() + i * 60 * 60 * 1000);

      const localTimeString = localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      slots.push({
        local: localTime.toISOString(),
        display: localTimeString,
      });
    }

    return slots;
  };

  const handleTime = (item: { local: string; display: string }) => {
    setSelectedTime(item.display);
    setAdminStartTime?.(item.local);
    console.log("adminStartTime (Local):", item.local);
    console.log("Displayed Time (Local):", item.display);
  };

  const timeSlots = generateTimeSlots();

  // Sort the time slots by local time
  timeSlots.sort((a, b) => new Date(a.local).getTime() - new Date(b.local).getTime());

  return (
    <View style={{ width: '100%', alignItems: 'center', position: 'relative' }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ backgroundColor: 'transparent', position: 'relative', paddingVertical: 10 }}
      >
        <Text allowFontScaling={false} style={{ fontSize: 14, color: "white", fontWeight: "bold" }}>
          {selectedTime || "See Times"}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '60%',
              alignSelf: 'center',
              borderRadius: 10,
              paddingTop: 10,
              height: 300,
              backgroundColor: '#222',
              zIndex: 100,
              position: 'absolute',
              top: '40%',
            }}
          >
            <FlatList
              data={timeSlots}
              keyExtractor={(item) => item.local}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    handleTime(item);
                    setModalVisible(false);
                  }}
                  style={{ padding: 10, backgroundColor: '#222' }}
                >
                  <Text allowFontScaling={false} style={{ fontSize: 14, color: '#fff' }}>{item.display || 'See Times'}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ padding: 10, width: '100%', alignItems: 'flex-end' }}
            >
              <Text allowFontScaling={false} style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const EndSelectorAdmin = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { adminEndTime, setAdminEndTime } = useGVOContext();

  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const midnightLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    for (let i = 0; i < 24; i++) {
      const localTime = new Date(midnightLocal.getTime() + i * 60 * 60 * 1000);

      const localTimeString = localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      slots.push({
        local: localTime.toISOString(),
        display: localTimeString,
      });
    }

    return slots;
  };

  const handleTime = (item: { local: string; display: string }) => {
    setSelectedTime(item.display);
    setAdminEndTime?.(item.local);
    console.log("adminEndTime (Local):", item.local);
    console.log("Displayed Time (Local):", item.display);
  };

  const timeSlots = generateTimeSlots();

  // Sort the time slots by local time
  timeSlots.sort((a, b) => new Date(a.local).getTime() - new Date(b.local).getTime());

  return (
    <View style={{ width: '100%', alignItems: 'center', position: 'relative' }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ backgroundColor: 'transparent', position: 'relative', paddingVertical: 10 }}
      >
        <Text style={{ fontSize: 14, color: "white", fontWeight: "bold" }}>
          {selectedTime || "See Times"}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '60%',
              alignSelf: 'center',
              borderRadius: 10,
              paddingTop: 10,
              height: 300,
              backgroundColor: '#222',
              zIndex: 100,
              position: 'absolute',
              top: '40%',
            }}
          >
            <FlatList
              data={timeSlots}
              keyExtractor={(item) => item.local}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    handleTime(item);
                    setModalVisible(false);
                  }}
                  style={{ padding: 10, backgroundColor: '#222' }}
                >
                  <Text allowFontScaling={false} style={{ fontSize: 14, color: '#fff' }}>{item.display || 'See Times'}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ padding: 10, width: '100%', alignItems: 'flex-end' }}
            >
              <Text allowFontScaling={false} style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function BookScreen() {
  const today = new Date()
  const yesterday = new Date();
  yesterday.setDate(new Date(today).getDate() - 1);

  const [startDate, setStartDate] = useState(today);
  const {daySelectedIndex, setDaySelectedIndex} = useGVOContext();
  const [availability, setAvailability] = useState<any[]>([]);
  const [todaysAvailability, setTodaysAvailability] = useState<any[]>([]);
  const [adminMode, setAdminMode] = useState(false);
  const [defaultTimeAmount, setDefaultTimeAmount] = useState(1);
  const {adminStartTime, setAdminStartTime} = useGVOContext();
  const {adminEndTime, setAdminEndTime, wantsToAuthenticate, setWantsToAuthenticate} = useGVOContext();

  function getDaysOfMonth(start: string) {
    const days = [];
    const date = new Date(start);
    const year = date.getFullYear();
    const month = date.getMonth();
    const currentDate = new Date(year, month, 1);
    while (currentDate.getMonth() === month) {
      days.push(currentDate.toISOString());
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  }
  const daysOfMonth = getDaysOfMonth(startDate.toISOString());
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  const handleArrowClick = (direction: 'forward' | 'backward') => {
    const newStartDate = new Date(startDate);
    if (direction === 'forward') {
      newStartDate.setMonth(new Date(startDate).getMonth() + 1);
      setDaySelectedIndex?.(-1);
    } else {
      newStartDate.setMonth(new Date(startDate).getMonth() - 1);
      if (newStartDate < new Date(today)) {
        newStartDate.setMonth(new Date(today).getMonth());
      }
      setDaySelectedIndex?.(-1);
    }
    setStartDate(newStartDate);
  };

  const handleDayPress = (index: number) => {
    if (daySelectedIndex === index) {
      setDaySelectedIndex?.(-1);
    } else {
      setDaySelectedIndex?.(index);
      const selectedDay = new Date(daysOfMonth[index]);
      if (selectedDay.getMonth() !== new Date(startDate).getMonth()) {
        setStartDate(selectedDay);
      }
    }
  };

  const fetchAvailibility = async () => {
    const result = await sql`SELECT * FROM room_availability`;
    setAvailability(result);
    // console.log("Availability:", result);
  };

  const fetchTodaysAvailibility = async () => {
    const midnightToday = new Date(today);
    midnightToday.setHours(0, 0, 0, 0); // Set to local midnight
    const formattedMidnightToday = midnightToday.toISOString().split('T')[0] + 'T00:00:00.000Z';
    console.log("midnightToday", formattedMidnightToday);
    const result = await sql`SELECT * FROM room_availability WHERE date = ${formattedMidnightToday}`;
    setTodaysAvailability(result);
  };

  useEffect(() => {
    if (todaysAvailability) {
      console.log("Todays Availability:", todaysAvailability);
    }
  }, [todaysAvailability]);

  useEffect(() => {
    fetchAvailibility();
    fetchTodaysAvailibility();
  }, []);

  const getAvailabilityForDay = (day: string) => {
    return availability.filter(item => item.date.split('T')[0] === day.split('T')[0]);
  };

  const rooms = [
    "", "A Room", "B Room", "C Room"
  ]

  const [cardTimes, setCardTimes] = useState<Record<number, number>>({});
  const {userStartTime, setUserStartTime} = useGVOContext();

  const handleMinusTime = (id: number) => {
    setCardTimes((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || defaultTimeAmount) - 1, 0),
    }));
  };
  
  const handlePlusTime = (id: number) => {
    setCardTimes((prev) => ({
      ...prev,
      [id]: (prev[id] || defaultTimeAmount) + 1,
    }));
  };

  const bookTime = async (startTime: string, requestedHours: number, roomIndex: number, startDate: string) => {
  
    console.log("bookTime", startTime, requestedHours, roomIndex, startDate);
  
    if (!startTime) {
      alert("Please select a time to book");
      return;
    }
  
    const formattedDate = startDate.split('T')[0] + 'T00:00:00.000Z';
    console.log("Formatted Date:", formattedDate);
  
    const calculateEndTime = (start: string, hoursToBook: number) => {
      const [date, timePart] = start.split('T');
      const [hour, minute, second] = timePart.split(':');
      const endHour = (parseInt(hour) + hoursToBook).toString().padStart(2, '0');
      return `${date}T${endHour}:${minute}:${second}`;
    };
  
    const endTime = calculateEndTime(startTime, requestedHours);
  
    const currentAvailability = await sql`SELECT * FROM room_availability WHERE date = ${formattedDate} AND room_id = ${roomIndex}`;
  
    console.log("currentAvailability", currentAvailability);
  
    currentAvailability.forEach(slot => {
      const start = slot.start_time.split('T')[1].slice(0, 5);
      const end = slot.end_time.split('T')[1].slice(0, 5);
      console.log(`Available from ${start} to ${end}`);
    });
  
    const isTimeAvailable = currentAvailability.some(slot => 
      slot.start_time <= startTime && 
      slot.end_time >= endTime
    );
  
    if (!isTimeAvailable) {
      alert("The selected time is not available. Please choose a different time.");
      return;
    }
  
    alert("The selected time is available. You can now book the session.");
  }

  const addAdminTime = async (startTime: string, endTime: string, startDate: string) => {
    console.log("Raw startTime:", startTime);
    console.log("Raw endTime:", endTime);

    const extractDateFromStartTime = (startTime: string): string => {
      return startTime.split('T')[0] + 'T00:00:00.000Z'; // Extract date and set time to midnight
    };

    const extractedDate = extractDateFromStartTime(startTime);

    console.log("Extracted Date:", extractedDate);

    const formatTime = (time: string): string => {
      const [date, timePart] = time.split('T');
      const [hour, minute] = timePart.split(':');
      const hour12 = parseInt(hour) % 12 || 12;
      const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minute} ${ampm}`;
    };

    const startFormatted = formatTime(startTime);
    const endFormatted = formatTime(endTime);

    console.log("Formatted Start Time:", startFormatted);
    console.log("Formatted End Time:", endFormatted);

    try {
      const roomIndices = [1, 2, 3];

      let timeSlots: string[] = [];
      let current = startTime;

      let adjustedEndTime = endTime;
      if (adjustedEndTime < current) {
        const datePart = adjustedEndTime.split('T')[0];
        const newDate = new Date(datePart);
        newDate.setDate(newDate.getDate() + 1);
        adjustedEndTime = newDate.toISOString().split('T')[0] + adjustedEndTime.slice(10);
      }

      while (current <= adjustedEndTime) {
        timeSlots.push(current);
        const [date, timePart] = current.split('T');
        const [hour, minute, second] = timePart.split(':');
        const newHour = (parseInt(hour) + 1).toString().padStart(2, '0');
        current = `${date}T${newHour}:${minute}:${second}`;
      }

      console.log(`Generated ${timeSlots.length} time slots`);
      console.log("Time Slots:", timeSlots.map(slot => formatTime(slot)));

      for (const roomIndex of roomIndices) {
        for (let i = 0; i < timeSlots.length - 1; i++) {
          const currentSlot = timeSlots[i];
          const nextSlot = timeSlots[i + 1];

          const existingAvailability = await sql`
            SELECT * FROM room_availability 
            WHERE room_id = ${roomIndex} 
            AND date = ${extractedDate}
            AND start_time = ${currentSlot} 
            AND end_time = ${nextSlot}
          `;

          console.log("Existing Availability Query Result:", existingAvailability);

          if (existingAvailability.length === 0) {
            console.log("date", extractedDate);

            await sql`
              INSERT INTO room_availability (room_id, start_time, end_time, is_available, date)
              VALUES (
                ${roomIndex}, 
                ${currentSlot}, 
                ${nextSlot}, 
                TRUE, 
                ${extractedDate}
              )
            `;
            console.log("Added admin time", extractedDate, currentSlot, nextSlot);
          } else {
            console.log("Skipping existing time slot", currentSlot, nextSlot);
          }
        }
      }

      console.log('Room availability successfully added for all rooms.');
      fetchAvailibility();
      fetchTodaysAvailibility();

    } catch (error) {
      console.error('Error adding room availability:', error);
    }
  };

  const [gvoUser, setGvoUser] = useState<any>();
  const {user} = useUser();

  const fetchUser = async () => {
    const userName = 'Twezo'
    const result = await sql`SELECT * FROM users WHERE clerk_id = ${user?.id}`;
    setGvoUser(result);
    // console.log(result);
  };

  useEffect(() => {      
      fetchUser();
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
      console.log("Refreshing...");
    setRefreshing(true);
    fetchUser();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    console.log("Refreshed!");
  };

  return (
    <>
    <SignedIn>

      <View style={{width: "100%", height: "100%", backgroundColor: gvoColors.dark, position: "absolute", zIndex: 1}}>
      </View>
      <SafeAreaView style={{width: "100%", position: "relative", zIndex: 2, backgroundColor: "transparent" }}>
        <ScrollView refreshControl={<RefreshControl colors={[gvoColors.azure]} tintColor={gvoColors.azure} refreshing={refreshing} onRefresh={handleRefresh} />} style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
          <View style={{padding: 20, width: "100%", backgroundColor: "transparent"}}>

            <Header/>

            <View style={styles.titleContainer}>
              {adminMode === false && (
                <Text allowFontScaling={false} style={{ fontSize: fontSizes.large - 6, fontWeight: 'bold', width: "80%" , color: gvoColors.dutchWhite}}>Studio Time.</Text>
              )}

              {adminMode === true && (
                <>
                <View style={{width: "100%", display: "flex", flexDirection: "column"}}>
                  <Text allowFontScaling={false} style={{ fontSize: fontSizes.large - 6, fontWeight: 'bold', width: "90%" , color: gvoColors.dutchWhite}}>GVO Schedule.</Text>
                </View>
                </>
              )}

            </View>

            <View style={{marginTop: 30, width: "100%"}}>

                <View style={{display: "flex", marginBottom: 20, alignItems: "flex-start", flexDirection: "column", gap: 5, width: "100%"}}>
                  {daySelectedIndex === -1 && (
                    <>
                    {gvoUser?.[0]?.role === "admin" && (
                      <>
                      <View style={{alignItems: "center", display: "flex", justifyContent: "center", flexDirection: "row", gap: 10}}>
                        <Text  style={[{fontSize: fontSizes.small, fontWeight: "bold", color: gvoColors.dutchWhite, textAlign: "center"}]}>Admin Mode</Text>
                        <Switch value={adminMode}  onValueChange={() => {setAdminMode(!adminMode)}}/>
                      </View>
                      </>
                    )}
                    </>
                  )}
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

                  <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontSize: fontSizes.medium, fontWeight: 'bold',}}>{months[startDate.getMonth()]} {startDate.getFullYear()}</Text>
                  
                  <TouchableOpacity onPress={() => handleArrowClick('forward')}>
                    <FontAwesome name="arrow-right" size={24} color={gvoColors.azure} />
                  </TouchableOpacity>
                
                </View>

                <View style={{display: "flex" , justifyContent: "flex-start", flexDirection: "row", flexWrap: "wrap", alignSelf: "center"}} >

                  {daysOfMonth.map((step, index) => {          
                    const isToday = new Date(step).toDateString() === today.toDateString(); // Check if the day is today
                    const isPast = new Date(step) < yesterday; // Check if the day is in the past
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
                        <Text allowFontScaling={false} style={{ 
                          fontSize: fontSizes.medium, 
                          fontWeight: 'bold', 
                          color: isPast ? gvoColors.semidark : (isSelected ? "white" : gvoColors.dutchWhite) 
                        }}>
                          {new Date(step).getDate()}
                        </Text>
                        {isToday && <View style={{ borderRadius: 5, backgroundColor: gvoColors.maize, padding:2, width: 55, display: "flex", alignItems: "center", position: 'absolute', top:"-40%", left: "-5%", zIndex: 10}}><Text allowFontScaling={false} style={{fontWeight: "bold", fontSize: fontSizes.small}}>Today</Text></View>}
                        {hasAvailability && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: gvoColors.azure, position: 'absolute', top: 5, right: 5 }} />}
                      </TouchableOpacity>
                    );
                  })}

                </View>

                <View style={{display: "flex", height: "100%", flexDirection: "column", gap: 20, paddingVertical: 20}}>
                  {/* If a day is selected, show its availability */}
                  {adminMode === false && (
                    <>
                    {daySelectedIndex !== -1 && (
                      <>
                        {getAvailabilityForDay(daysOfMonth[daySelectedIndex as number]).length === 0 ? (
                          <Text style={[{fontSize: fontSizes.small, fontWeight: "bold", color: gvoColors.dutchWhite, textAlign: "center"}]}>No rooms available.</Text>
                        ) : (
                          // getAvailabilityForDay(daysOfMonth[daySelectedIndex]).map((room, roomIndex) => (
                          rooms.slice(1, 4).map((room, roomIndex) => (
                            <View key={roomIndex} style={styles.roomContainer}>
                              <View style={[styles.roomHeader, {backgroundColor: room === "A Room" ? gvoColors.azure : room === "B Room" ? gvoColors.maize : room === "C Room" ? gvoColors.semidark : "transparent"}]}>
                                <Text allowFontScaling={false} style={[styles.roomText, {color: room === "B Room" ? gvoColors.dark : gvoColors.dutchWhite}]}>{rooms[roomIndex + 1]}</Text>
                                  <Text allowFontScaling={false} style={styles.roomSubText}>
                                    Available
                                  </Text>
                              </View>
                              <View style={styles.sessionContainer}>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", marginBottom: 10, justifyContent: "space-between"}}>
                                  <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Book while it's available:</Text>
                                  <View style={{display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 50, backgroundColor: gvoColors.semidark,}}>
                                    <Text allowFontScaling={false} style={{color: gvoColors.dark, fontWeight: "bold", fontSize: fontSizes.small}}>?</Text>
                                  </View>
                                </View>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                  <View style={{width: "75%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>Starts:</Text>
                                      <StartSelector availableTimes={todaysAvailability} roomId={roomIndex + 1}/>
                                    </View>
                                    <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>I want to book:</Text>
                                      <View style={{display: "flex", flexDirection: "row", gap: 6, alignItems: "center"}}>
                                      <FontAwesome onPress={() => handleMinusTime(roomIndex)} name="minus" size={fontSizes.small - 3} style={{backgroundColor: gvoColors.maize, borderRadius: 50, padding: 2}} color={gvoColors.dark} />
                                          <View style={{display: "flex", alignItems: 'center', flexDirection: "row", gap: 0}}>
                                          <Text allowFontScaling={false} style={{ color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.medium - 6 }}>
                                            {cardTimes[roomIndex] || defaultTimeAmount} hour
                                          </Text>
                                          {cardTimes[roomIndex] > 1 && (
                                            <Text allowFontScaling={false} style={{ color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>(s)</Text>                                     
                                          )}
                                        </View>
                                        <FontAwesome onPress={() => handlePlusTime(roomIndex)} name="plus" size={fontSizes.small - 3} style={{backgroundColor: gvoColors.maize, borderRadius: 50, padding: 2}} color={gvoColors.dark} />
                                      </View>
                                    </View>
                                  </View>
                                  <View style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <TouchableOpacity onPress={() => bookTime(userStartTime, cardTimes[roomIndex] || defaultTimeAmount, roomIndex + 1, userStartTime)} style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: gvoColors.azure, padding: 10, borderRadius: 6}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Book</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                            ))
                          // ))
                        )}
                      </>
                    )}
                    </>
                  )}

                  {adminMode === true && (
                    <>
                      {daySelectedIndex !== -1 && (
                        <>
                        {/* a room */}
                          <View style={styles.roomContainer}>
                              <View style={[styles.roomHeader, {backgroundColor:  gvoColors.azure}]}>
                                <Text style={[styles.roomText, {color: gvoColors.dutchWhite}]}>Schedule</Text>
                                  <Text style={styles.roomSubTextZero}>
                                    Open
                                  </Text>
                              </View>
                              <View style={styles.sessionContainer}>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", marginBottom: 10, justifyContent: "space-between"}}>
                                  <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Set GVO's session availability here:</Text>
                                  <View style={{display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 50, backgroundColor: gvoColors.semidark,}}>
                                    <Text allowFontScaling={false} style={{color: gvoColors.dark, fontWeight: "bold", fontSize: fontSizes.small}}>?</Text>
                                  </View>
                                </View>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                  <View style={{width: "70%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>Start Time</Text>
                                      <StartSelectorAdmin />
                                      </View>
                                    <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>End Time</Text>
                                      <EndSelectorAdmin />
                                      </View>
                                  </View>
                                  <View style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <TouchableOpacity onPress={() => addAdminTime(adminStartTime, adminEndTime, adminStartTime)} style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: gvoColors.azure, padding: 10, borderRadius: 6}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Book</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                          </View>
                          </>
                      )}
                    </>
                  )}

                  {daySelectedIndex === -1 && (
                    <>
                    <View style={{width: "100%", alignItems: "center", display: "flex", justifyContent: "center", flexDirection: "column", gap: 10}}>
                      <Text style={[{fontSize: fontSizes.small, fontWeight: "bold", color: gvoColors.dutchWhite, textAlign: "center"}]} >Select a day to see availability.</Text>
                    </View>
                    </>
                  )}

                </View>

            </View>

          </View>
        </ScrollView>
      </SafeAreaView>

    </SignedIn>


    <SignedOut>

      <View style={{width: "100%", height: "100%", backgroundColor: gvoColors.dark, position: "absolute", zIndex: 1}}>
      </View>
      <SafeAreaView style={{width: "100%", position: "relative", zIndex: 2, backgroundColor: "transparent" }}>
        <ScrollView refreshControl={<RefreshControl tintColor={gvoColors.azure} colors={[gvoColors.azure]} refreshing={refreshing} onRefresh={handleRefresh} />} style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
          <View style={{padding: 20, width: "100%", backgroundColor: "transparent"}}>

            <Header/>

            <View style={styles.titleContainer}>
              <Text allowFontScaling={false} style={{ fontSize: fontSizes.large - 6, fontWeight: 'bold', width: "80%" , color: gvoColors.dutchWhite}}>Studio Time.</Text>
            </View>

            <View style={{marginTop: 30, width: "100%"}}>

                <View style={{display: "flex", marginBottom: 20, alignItems: "flex-start", flexDirection: "column", gap: 5, width: "100%"}}>
                  {daySelectedIndex === -1 && (
                    <>
                    {gvoUser?.role === "admin" && (
                      <>
                      <View style={{alignItems: "center", display: "flex", justifyContent: "center", flexDirection: "row", gap: 10}}>
                        <Text  style={[{fontSize: fontSizes.small, fontWeight: "bold", color: gvoColors.dutchWhite, textAlign: "center"}]}>Admin Mode</Text>
                        <Switch value={adminMode}  onValueChange={() => {setAdminMode(!adminMode)}}/>
                      </View>
                      </>
                    )}
                    </>
                  )}
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

                  <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontSize: fontSizes.medium, fontWeight: 'bold',}}>{months[startDate.getMonth()]} {startDate.getFullYear()}</Text>
                  
                  <TouchableOpacity onPress={() => handleArrowClick('forward')}>
                    <FontAwesome name="arrow-right" size={24} color={gvoColors.azure} />
                  </TouchableOpacity>
                
                </View>

                <View style={{display: "flex" , justifyContent: "flex-start", flexDirection: "row", flexWrap: "wrap", alignSelf: "center"}} >

                  {daysOfMonth.map((step, index) => {          
                    const isToday = new Date(step).toDateString() === today.toDateString(); // Check if the day is today
                    const isPast = new Date(step) < yesterday; // Check if the day is in the past
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
                        <Text allowFontScaling={false} style={{ 
                          fontSize: fontSizes.medium, 
                          fontWeight: 'bold', 
                          color: isPast ? gvoColors.semidark : (isSelected ? "white" : gvoColors.dutchWhite) 
                        }}>
                          {new Date(step).getDate()}
                        </Text>
                        {isToday && <View style={{ borderRadius: 5, backgroundColor: gvoColors.maize, padding:2, width: 55, display: "flex", alignItems: "center", position: 'absolute', top:"-40%", left: "-5%", zIndex: 10}}><Text allowFontScaling={false} style={{fontWeight: "bold", fontSize: fontSizes.small}}>Today</Text></View>}
                        {hasAvailability && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: gvoColors.azure, position: 'absolute', top: 5, right: 5 }} />}
                      </TouchableOpacity>
                    );
                  })}

                </View>

                <View style={{display: "flex", height: "100%", flexDirection: "column", gap: 20, paddingVertical: 20}}>
                  {/* If a day is selected, show its availability */}
                  {adminMode === false && (
                    <>
                    {daySelectedIndex !== -1 && (
                      <>
                        {getAvailabilityForDay(daysOfMonth[daySelectedIndex as number]).length === 0 ? (
                          <Text style={[{fontSize: fontSizes.small, fontWeight: "bold", color: gvoColors.dutchWhite, textAlign: "center"}]}>No rooms available.</Text>
                        ) : (
                          // getAvailabilityForDay(daysOfMonth[daySelectedIndex]).map((room, roomIndex) => (
                          rooms.slice(1, 4).map((room, roomIndex) => (
                            <View key={roomIndex} style={styles.roomContainer}>
                              <View style={[styles.roomHeader, {backgroundColor: room === "A Room" ? gvoColors.azure : room === "B Room" ? gvoColors.maize : room === "C Room" ? gvoColors.semidark : "transparent"}]}>
                                <Text allowFontScaling={false} style={[styles.roomText, {color: room === "B Room" ? gvoColors.dark : gvoColors.dutchWhite}]}>{rooms[roomIndex + 1]}</Text>
                                  <Text allowFontScaling={false} style={styles.roomSubText}>
                                    Available
                                  </Text>
                              </View>
                              <View style={styles.sessionContainer}>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", marginBottom: 10, justifyContent: "space-between"}}>
                                  <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Book while it's available:</Text>
                                  <View style={{display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 50, backgroundColor: gvoColors.semidark,}}>
                                    <Text allowFontScaling={false} style={{color: gvoColors.dark, fontWeight: "bold", fontSize: fontSizes.small}}>?</Text>
                                  </View>
                                </View>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                  <View style={{width: "75%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>Starts:</Text>
                                      <StartSelector availableTimes={todaysAvailability} roomId={roomIndex + 1}/>
                                    </View>
                                    <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>I want to book:</Text>
                                      <View style={{display: "flex", flexDirection: "row", gap: 6, alignItems: "center"}}>
                                      <FontAwesome onPress={() => handleMinusTime(roomIndex)} name="minus" size={fontSizes.small - 3} style={{backgroundColor: gvoColors.maize, borderRadius: 50, padding: 2}} color={gvoColors.dark} />
                                          <View style={{display: "flex", alignItems: 'center', flexDirection: "row", gap: 0}}>
                                          <Text allowFontScaling={false} style={{ color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.medium - 6 }}>
                                            {cardTimes[roomIndex] || defaultTimeAmount} hour
                                          </Text>
                                          {cardTimes[roomIndex] > 1 && (
                                            <Text allowFontScaling={false} style={{ color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>(s)</Text>                                     
                                          )}
                                        </View>
                                        <FontAwesome onPress={() => handlePlusTime(roomIndex)} name="plus" size={fontSizes.small - 3} style={{backgroundColor: gvoColors.maize, borderRadius: 50, padding: 2}} color={gvoColors.dark} />
                                      </View>
                                    </View>
                                  </View>
                                  <View style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <TouchableOpacity onPress={() => setWantsToAuthenticate?.(true)} style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: gvoColors.azure, padding: 10, borderRadius: 6}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Sign in</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                            ))
                          // ))
                        )}
                      </>
                    )}
                    </>
                  )}

                  {adminMode === true && (
                    <>
                      {daySelectedIndex !== -1 && (
                        <>
                        {/* a room */}
                          <View style={styles.roomContainer}>
                              <View style={[styles.roomHeader, {backgroundColor:  gvoColors.azure}]}>
                                <Text style={[styles.roomText, {color: gvoColors.dutchWhite}]}>Schedule</Text>
                                  <Text style={styles.roomSubTextZero}>
                                    Open
                                  </Text>
                              </View>
                              <View style={styles.sessionContainer}>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", marginBottom: 10, justifyContent: "space-between"}}>
                                  <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Set GVO's session availability here:</Text>
                                  <View style={{display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 50, backgroundColor: gvoColors.semidark,}}>
                                    <Text allowFontScaling={false} style={{color: gvoColors.dark, fontWeight: "bold", fontSize: fontSizes.small}}>?</Text>
                                  </View>
                                </View>
                                <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                  <View style={{width: "70%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>Start Time</Text>
                                      <StartSelectorAdmin />
                                      </View>
                                    <View style={{display: "flex", flexDirection: "column", gap: 5}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>End Time</Text>
                                      <EndSelectorAdmin />
                                      </View>
                                  </View>
                                  <View style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <TouchableOpacity onPress={() => addAdminTime(adminStartTime, adminEndTime, adminStartTime)} style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: gvoColors.azure, padding: 10, borderRadius: 6}}>
                                      <Text allowFontScaling={false} style={{color: gvoColors.dutchWhite, fontWeight: "bold", fontSize: fontSizes.small}}>Book</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                          </View>
                          </>
                      )}
                    </>
                  )}

                  {daySelectedIndex === -1 && (
                    <>
                    <View style={{width: "100%", alignItems: "center", display: "flex", justifyContent: "center", flexDirection: "column", gap: 10}}>
                      <Text style={[{fontSize: fontSizes.small, fontWeight: "bold", color: gvoColors.dutchWhite, textAlign: "center"}]} >Select a day to see availability.</Text>
                    </View>
                    </>
                  )}

                </View>

            </View>

          </View>
        </ScrollView>
      </SafeAreaView>

    </SignedOut>
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
