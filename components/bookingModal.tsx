import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Modal, Button } from "react-native";
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { gvoColors } from "@/constants/Colors";
import { FontAwesome } from '@expo/vector-icons';

export default function BookingModal() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        gap: {
          marginVertical: 20,
        },
        text: {
          fontSize: 60,
          fontWeight: 'bold',
          color: gvoColors.dutchWhite
        },
        heading: {
          fontSize: 60,
          fontWeight: 'bold',
          color: gvoColors.dutchWhite,
        },
        title: {
          fontSize: 20,
          fontWeight: 'bold',
          color: gvoColors.dutchWhite,
        },
        bettertittle: {
          fontSize: 45,
          fontWeight: 'bold',
      },
        option: {
          fontSize: 20,
          paddingVertical: 10,
          color: gvoColors.dutchWhite,
        },
        separator: {
          marginVertical: 30,
          height: 1,
          width: '80%',
        },
        readioRedTitle: {
          color: gvoColors.dustyOrange,
          fontSize: 20,
          fontWeight: 'bold',
          marginVertical: 5,
        },
        recentlySavedContainer: {
          display: 'flex',
          gap: 10,
          flexDirection: 'row',
          width: '100%',
          height: 'auto',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginVertical: 15,
          backgroundColor: "transparent"
        },
        recentlySavedItems: {
          display: 'flex',
          width: '48%',
          height: 'auto',
          gap: 5,
          borderRadius: 10,
        },
        recentlySavedImg: {
          width: '100%',
          height: 150,
          backgroundColor: gvoColors.dutchWhite,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        recentlySavedTItle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: gvoColors.dutchWhite,
        },
        recentlySavedSubheading: {
          fontSize: 15,
          color: gvoColors.dutchWhite,
        },
        nowPlayingImage: {
          width: '100%', 
          height: 150, 
          overflow: 'hidden', 
          position: 'absolute', 
          right: 0, 
          top: 0, 
          borderRadius: 10
        },
      });
    return (
        <>

        </>
    )
}