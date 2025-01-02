import { View, Text, Animated } from "react-native";
import { StyleSheet } from "react-native";
import FastImage from 'react-native-fast-image';
import { FontAwesome } from "@expo/vector-icons";
import { gvoColors } from "@/constants/Colors";
import { fontSizes } from "@/constants/Fontsizes";
import { useRef, useEffect } from "react";

export default function Session ({ status, theDate, startTime, endTime, roomid }: { status: string, theDate: any, startTime: any, endTime: any, roomid: any }) {
    
    const rooms = [
        "",
        "A",
        "B",
        "C",
    ]

    return (
        <>
                      <View style={styles.thread}>
                  <View style={styles.threadbox}>
                      
                      <View style={{width: "10%", display: "flex", backgroundColor: roomid === 1 ? gvoColors.azure : roomid === 2 ? gvoColors.maize : roomid === 3 ? gvoColors.semidark : "transparent", alignItems: "center", justifyContent: "center", height: "100%",}}>  
                          <Text style={[styles.stationName, {color: roomid === 2 ? gvoColors.dark : gvoColors.dutchWhite}]}>{rooms[roomid as unknown as number]}</Text>
                      </View>
                      
                      <View style={{width: "90%", paddingRight: 10, height: "100%", alignItems: "flex-start", justifyContent: "center", display: "flex", flexDirection: "column"}}>
                          <View style={{width: "100%", borderBottomColor: gvoColors.semidark, borderBottomWidth: 1, paddingBottom: 5, marginBottom: 5, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: fontSizes.small, color: gvoColors.dutchWhite}}>Date</Text>
                            <Text style={styles.stationName}>{theDate}</Text>
                          </View>
                          <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                            <View>
                                <Text style={{fontSize: fontSizes.small, color: gvoColors.semidark}}>Start Time</Text>
                                <Text style={styles.stationName}>{startTime}</Text>
                                <Text style={{fontSize: fontSizes.small, color: gvoColors.semidark}}>End Time</Text>
                                <Text style={styles.stationName}>{endTime}</Text>
                            </View>
                            <View style={{width: "60%", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, height: "60%"}}>
                                <Text style={{fontSize: fontSizes.small, color: gvoColors.semidark}}>Status</Text>
                                <View style={{width: "100%", position: "relative", borderRadius: 10,  height: "100%", alignItems: "center", justifyContent: "center"}}>
                                    <View style={{position: "absolute", top: 0, right: "-10%", alignItems: "flex-end", justifyContent: "flex-end", zIndex: 1}}>
                                        <BlinkingStatus color={status === "complete" ? "green" : status === "booked" ? gvoColors.maize : gvoColors.semidark} />
                                    </View>
                                    <Text style={{fontSize: fontSizes.medium, fontWeight: "bold", color: status === "complete" ? "green" : status === "booked" ? gvoColors.maize : gvoColors.semidark}}>{status}</Text>
                                </View>
                            </View>
                          </View>
                      </View>
                  </View>
              </View>  
        </>
    );
}

const BlinkingStatus = ({ color }: { color: string }) => {
    const blinkAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [blinkAnim]);

    useEffect(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
    
          const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }, 2000); // Toast will be visible for 2 seconds
    
          return () => clearTimeout(timer); // Cleanup timer on unmount
    
    }, [fadeAnim]);



    return (
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5,  justifyContent: 'space-between', paddingHorizontal:25}}>
            
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
                
                <Animated.View style={{ opacity: blinkAnim}}>
                    <FontAwesome name="circle" size={14} color={color} />
                </Animated.View>            
            </View>
            <View>
                {/* <FontAwesome onPress={handleStationPress} name="refresh" size={18} color="#fff" /> */}
            </View>
        </View>
    );
};

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
      height: 150,
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
    stationName: {
        fontSize: fontSizes.small + 1,
        fontWeight: "bold",
        color: gvoColors.dutchWhite
    },
    stationText: {
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