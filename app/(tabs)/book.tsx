import { Image, ScrollView, Modal, RefreshControl, FlatList, StyleSheet, View, Platform, Text, TouchableOpacity, Switch, Pressable } from 'react-native';
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
import BookingModal from '@/components/bookingModal';
import { KeyboardAvoidingView, Button } from "react-native";

const StartSelector = ({ availableTimes, roomId }: { availableTimes?: Array<{ id: any, start_time: string; end_time: string; room_id: number }>, roomId: number }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {userStartTime, setUserStartTime} = useGVOContext();
  const [selectedTimeLocal, setSelectedTimeLocal] = useState<string | null>(null);

  if (!availableTimes) {
    console.error("No valid availability data provided.");
    return null;
  }

  // Filter available times by the room index
  availableTimes = availableTimes.filter(time => time.room_id === roomId);

  const handleTime = (item: any) => {
    setSelectedTimeLocal(item.start_time);
    setSelectedTime(item.start_time);
    setUserStartTime?.(item.start_time);
    setModalVisible(false);
  };


  return (
    <View style={{ width: '100%', alignItems: 'center', position: 'relative' }}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ paddingVertical: 10 }}>
        <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
          {selectedTime ? selectedTime : "See Times"}
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
                    {item.start_time}
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

  const handleTime = (item: any) => {
    setSelectedTime(item);
    setAdminStartTime?.(item);
  };

  // const timeSlots = generateTimeSlots();
  const timeSlots = [
    '12:00 AM',
    '1:00 AM',
    '2:00 AM',
    '3:00 AM',
    '4:00 AM',
    '5:00 AM',
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
  ]


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
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    handleTime(item);
                    setModalVisible(false);
                  }}
                  style={{ padding: 10, backgroundColor: '#222' }}
                >
                  <Text allowFontScaling={false} style={{ fontSize: 14, color: '#fff' }}>{item}</Text>
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

  const handleTime = (item: any) => {
    setSelectedTime(item);
    setAdminEndTime?.(item);
  };

  const timeSlots = [
    '12:00 AM',
    '1:00 AM',
    '2:00 AM',
    '3:00 AM',
    '4:00 AM',
    '5:00 AM',
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
  ]

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
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    handleTime(item);
                    setModalVisible(false);
                  }}
                  style={{ padding: 10, backgroundColor: '#222' }}
                >
                  <Text allowFontScaling={false} style={{ fontSize: 14, color: '#fff' }}>{item}</Text>
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
  const [selectedDay, setSelectedDay] = useState(today);
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
      setSelectedDay(new Date(daysOfMonth[index]));
    } else {
      setDaySelectedIndex?.(index);
      setSelectedDay(new Date(daysOfMonth[index]));
      const selectedDay = new Date(daysOfMonth[index]);
      if (selectedDay.getMonth() !== new Date(startDate).getMonth()) {
        setStartDate(selectedDay);
      }
    }
  };

  const fetchAvailibility = async () => {
    const result = await sql`SELECT * FROM room_availability`;
    setAvailability(result);
  };

  const fetchTodaysAvailibility = async () => {
    const midnightToday = new Date(today);
    midnightToday.setHours(0, 0, 0, 0); // Set to local midnight
    const formattedMidnightToday = midnightToday.toISOString().split('T')[0] + 'T00:00:00.000Z';
    const result = await sql`SELECT * FROM room_availability WHERE date = ${midnightToday} AND clerk_id IS NULL ORDER BY id ASC`;
    setTodaysAvailability(result);
  };

  useEffect(() => {
    if (todaysAvailability) {
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

  const bookTime = async (startTime: string, requestedHours: number, roomIndex: number, startDate: Date, numberOfPeople?: number) => {
  
  
    if (!startTime) {
      alert("Please select a time to book");
      return;
    }
  
    const allTimeSlots = [
      '12:00 AM',
      '1:00 AM',
      '2:00 AM',
      '3:00 AM',
      '4:00 AM',
      '5:00 AM',
      '6:00 AM',
      '7:00 AM',
      '8:00 AM',
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM',
      '6:00 PM',
      '7:00 PM',
      '8:00 PM',
      '9:00 PM',
      '10:00 PM',
      '11:00 PM',
    ];

    const startIndex = allTimeSlots.indexOf(startTime);
    const endIndex = startIndex + requestedHours;
    const endTime = allTimeSlots[endIndex];
    const studioSession = allTimeSlots.slice(startIndex, endIndex);
    const numOfPeps = numberOfPeople ? numberOfPeople : 1;
    const status = "booked";

    for (const hour of studioSession) {
      console.log("starting....")
      try {
        await sql`UPDATE room_availability SET clerk_id = ${user?.id} WHERE date = ${startDate} AND room_id = ${roomIndex} AND start_time = ${hour};`;
      } catch (error) {
        console.error(error);
      }
      console.log('finished....')
    }
    
    try {
      await sql`INSERT INTO bookings (room_id, start_time, end_time, number_of_people, status, clerk_id, date) VALUES (${roomIndex}, ${startTime}, ${endTime}, ${numOfPeps}, ${status}, ${user?.id}, ${selectedDay});`;
    } catch (error) {
      console.error(error);
    }
  
    alert("The session has been booked successfully");
  }

  const addAdminTime = async (startTime: string, endTime: string, startDate: Date) => {

    const allTimeSlots = [
      '12:00 AM',
      '1:00 AM',
      '2:00 AM',
      '3:00 AM',
      '4:00 AM',
      '5:00 AM',
      '6:00 AM',
      '7:00 AM',
      '8:00 AM',
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM',
      '6:00 PM',
      '7:00 PM',
      '8:00 PM',
      '9:00 PM',
      '10:00 PM',
      '11:00 PM',
    ];


      const startIndex = allTimeSlots.indexOf(startTime);
      const endIndex = allTimeSlots.indexOf(endTime);

      const selectedTimeSlots = allTimeSlots.slice(startIndex, endIndex + 1);
    
    const roomIndices = [1, 2, 3];

    for (const roomIndex of roomIndices) {
      for (const selectedTimeSlot of selectedTimeSlots) {
        try { 
          console.log("starting....")
          await sql`INSERT INTO room_availability (date, start_time, end_time, room_id) VALUES (${startDate}, ${selectedTimeSlot}, ${selectedTimeSlot}, ${roomIndex});`;
          console.log('finished....')
        } catch (error) {
          console.error("Error inserting time slot:", error);
        }
      }
    }
  };

  const [gvoUser, setGvoUser] = useState<any>();
  const {user} = useUser();

  const fetchUser = async () => {
    const userName = 'Twezo'
    const result = await sql`SELECT * FROM users WHERE clerk_id = ${user?.id}`;
    setGvoUser(result);
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const toggleModal = () => {
      setIsModalVisible(!isModalVisible);
  };

  const studioRules = `
1. Booking Policies
    1. Deposit & Payment:
    •	A 50% deposit is required to confirm the booking.
    •	Full payment is due before the session begins.
    2. Cancellations:
    •	Cancellations must be made at least 48 hours in advance for a refund of the deposit.
    •	Cancellations within 48 hours will result in a forfeited deposit.
    3. Rescheduling:
    •	Rescheduling is allowed once, with at least 48 hours’ notice, subject to availability.

2. Studio Use Guidelines
    1. Arrival & Setup:
    •	Clients must arrive on time. Session time begins at the scheduled time, not at arrival.
    •	Allow sufficient time for setup and teardown within your booked session.
    2. Cleanliness:
    •	Leave the studio in the condition you found it. A cleaning fee may apply for excessive mess.
    3. Guests:
    •	A maximum of 2 guests is allowed per session unless prior approval is given.
    4. Prohibited Items:
    •	Smoking, vaping, drugs, and alcohol are strictly prohibited in the studio.
    •	Weapons or illegal substances are not permitted on the premises.

3. Equipment Use
    1. Responsibility:
    •	Clients are responsible for any damage to studio equipment during their session.
    •	Replacement or repair costs will be charged if equipment is damaged due to negligence.
    2. Usage:
    •	Equipment must only be used as intended and under proper supervision.
    •	Notify staff immediately of any issues or malfunctions.
    
4. Sound Levels & Noise
    1. Volume:
    •	Maintain appropriate sound levels to avoid disturbing other sessions or neighbors.
    2. Noise Complaints:
    •	Non-compliance with sound regulations may result in termination of the session without a refund.

5. Liability
    1. Personal Items:
    •	The studio is not responsible for lost, stolen, or damaged personal items.
    2. Injuries:
    •	Clients and guests assume full responsibility for their safety while on the premises.

6. Media Rights & Recordings
    1. Media Sharing:
    •	The studio may request permission to use photos or videos of the session for promotional purposes.
    2. Privacy:
    •	The studio respects client privacy. Sessions will not be recorded or monitored without consent.

7. Termination of Session
    1. Behavior:
    •	Disrespectful, aggressive, or inappropriate behavior will result in immediate termination of the session without a refund.
    2. Rule Compliance:
    •	Non-compliance with these rules may result in being banned from future bookings.

Acknowledgment

By pressing the agree button below, the client agrees to abide by all studio rules and policies. Failure to comply may result in additional fees or the termination of studio access.

  `

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
                                <View style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                  
                                  <View style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                    
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

                                  <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                    
                                    <View style={{display: "flex", flexDirection: "row", gap: 10, alignItems: "center", paddingVertical: 10, width: '70%'}}>
                                      <View style={{ backgroundColor: agreedToTerms ? gvoColors.azure : gvoColors.semidark, borderRadius: 50, padding: 4, height: 20, width: 20, alignItems: 'center'}}>
                                        <FontAwesome name="check" size={fontSizes.small - 3} style={{}} color={agreedToTerms ? gvoColors.dutchWhite : gvoColors.dark} />
                                      </View>
                                      {agreedToTerms ? (
                                        <Text allowFontScaling={false} style={{color: agreedToTerms ? gvoColors.dutchWhite : gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>I have read and agree to the studio terms and rules</Text>
                                      ) : (
                                        <Text allowFontScaling={false} style={{color: agreedToTerms ? gvoColors.dutchWhite : gvoColors.semidark, fontWeight: "bold", fontSize: fontSizes.small}}>Press 'terms' to agree and book your session</Text>

                                      )}
                                    </View>

                                    <TouchableOpacity onPress={() => {agreedToTerms ? bookTime(userStartTime, cardTimes[roomIndex] || defaultTimeAmount, roomIndex + 1, selectedDay) : setIsModalVisible(true)}} style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: agreedToTerms ? gvoColors.azure : gvoColors.semidark, padding: 10, borderRadius: 6}}>

                                          {agreedToTerms ? (
                                            <Text allowFontScaling={false} style={{color: agreedToTerms ? gvoColors.dutchWhite : gvoColors.dark, fontWeight: "bold", fontSize: fontSizes.small}}>Book</Text>
                                          ) : (                                         
                                            <Text allowFontScaling={false} style={{color: agreedToTerms ? gvoColors.dutchWhite : gvoColors.dark, fontWeight: "bold", fontSize: fontSizes.small}}>Terms</Text>
                                          ) }
                                    
                                    </TouchableOpacity>

                                  </View>

                               
                                </View>
                              </View>
                            </View>
                            ))
                          // ))
                        )}
                        <Modal
                          animationType="slide" 
                          transparent={true} 
                          visible={isModalVisible}
                          onRequestClose={toggleModal}
                          style={{width: '100%', height: '100%', display: 'flex', alignContent: 'center', alignItems: 'center',  justifyContent: 'center' }}
                        >

                        <View style={{width: '100%', top: '10%', right: '10%', position: 'absolute', zIndex: 2, display: 'flex', alignItems: 'flex-end', backgroundColor: "transparent"}}>
                          <TouchableOpacity onPress={toggleModal}>
                            <FontAwesome name="close" size={30} color={gvoColors.dutchWhite} />
                          </TouchableOpacity>
                        </View>

                        <View style={{width: '100%', height: '100%', display: 'flex', alignContent: 'center', alignItems: 'center',  justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)', }}>

                          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10} style={{paddingHorizontal: 20, borderRadius: 10, width: '90%', height: '70%', gap: 20, display: 'flex', justifyContent: 'flex-start', paddingVertical: "5%"}}>
                            

                            <ScrollView>
                              <Text style={{color: gvoColors.dutchWhite, fontSize: fontSizes.medium}}>
                              Studio Rules & 
                              </Text>
                              <Text style={{color: gvoColors.dutchWhite, fontSize: fontSizes.medium}}> 
                              Terms for Booking
                              </Text>
                              <View style={{height: 10}}/>
                              
                              <Text style={{color: gvoColors.dutchWhite, fontSize: fontSizes.small}}>
                              To ensure a smooth and professional experience, clients must agree to the following rules before booking:
                              </Text>
                              <Text style={{color: gvoColors.dutchWhite, textAlign: 'left'}}>
                                {studioRules}
                              </Text>
                            </ScrollView>

                            <View>
                              <Pressable onPress={() => {setAgreedToTerms(true); toggleModal();}} style={{backgroundColor: gvoColors.azure, padding: 10, borderRadius: 600}}>
                                <Text style={{color: gvoColors.dutchWhite, fontSize: fontSizes.small, fontWeight: 'bold', textAlign: 'center'}}>Agree</Text>
                              </Pressable>
                            </View>

                          </KeyboardAvoidingView>



                        </View>
                        </Modal>
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
                                    <TouchableOpacity onPress={() => addAdminTime(adminStartTime, adminEndTime, selectedDay)} style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: gvoColors.azure, padding: 10, borderRadius: 6}}>
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
