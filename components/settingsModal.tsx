import { useUser } from '@clerk/clerk-expo';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useGVOContext } from '@/constants/gvoContext';
import sql from '@/helpers/neonClient';
import { gvoColors } from '@/constants/Colors';
import { router } from "expo-router";
import { useClerk } from '@clerk/clerk-react'

export const SettingsModal = ({ visible, onClose }: { visible: boolean; onClose: () => void; }) => {
    
    const [showModal, setShowModal] = useState(visible);
    const {user} = useUser();
    const [gvoUser, setGvoUser] = useState<any>();
    const textInputRef = useRef<TextInput>(null);
    const { signOut } = useClerk()


    const fetchUser = async () => {
        const userName = 'Twezo'
        const result = await sql`SELECT * FROM users WHERE clerk_id = ${user?.id}`;
        setGvoUser(result);
        // console.log(result);
    };

    useEffect(() => {
        if (visible) {
          fetchUser();
          setShowModal(true);
          textInputRef.current?.focus();
        } else {
          setShowModal(false);
        }
      }, [visible]);
    
    useEffect(() => {
    // Ensure keyboard is always visible
      const keyboardShowListener = Keyboard.addListener('keyboardDidHide', () => {
          textInputRef.current?.focus();
      });

      return () => {
          keyboardShowListener.remove();
      };

    }, []);

    const handleSignOut = async () => {
      try {
        router.push("/(tabs)/home");
        await signOut({});
        // Redirect to your desired page
        console.log('Signed out!');
        onClose();
        // Reload the app after closing
        router.push("/(tabs)/myprofile");
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2));
      }
    }



    return (
        <Modal
          transparent
          visible={showModal}
          animationType="fade"
          onRequestClose={onClose}
        >
          {/* <SafeAreaView style={styles.modalBackground}> */}
            <KeyboardAvoidingView
              style={styles.modalContainer}
              behavior="padding"
              keyboardVerticalOffset={5}
            >     
            <View style={{width: "100%", height: "100%", position: "relative"}}>
                <View style={styles.header}>
                <View style={styles.headerLeft}>
                <TouchableOpacity onPress={onClose}>
                    <Text allowFontScaling={false} style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.headerCenter}>
                <Text allowFontScaling={false} style={styles.closeButtonText}>Settings</Text>
                </View>
                <View style={styles.headerRight}>
                <View style={styles.infoIcon}>
                    <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>i</Text>
                </View>
                </View>
                </View>   

                <View style={{padding: 20, display: "flex", flexDirection: "column", gap: 30, width: "100%"}}>
                    <View style={{display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems: "center"}}>
                        <Text allowFontScaling={false} style={[styles.modalText, {width: "30%", marginRight: 10}]}>Name</Text>
                        <TextInput allowFontScaling={false} style={styles.modalPostText} placeholder={gvoUser?.[0]?.name} placeholderTextColor={gvoColors.dutchWhite} />
                    </View>
                    <View style={{display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems: "center"}}>
                        <Text allowFontScaling={false} style={[styles.modalText, {width: "30%", marginRight: 10}]}>Username</Text>
                        <TextInput allowFontScaling={false} style={styles.modalPostText} placeholder={gvoUser?.[0]?.username} placeholderTextColor={gvoColors.dutchWhite} />
                    </View>
                    <View style={{display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems: "flex-start"}}>
                        <Text allowFontScaling={false} style={[styles.modalText, {width: "30%", marginRight: 10}]}>Bio</Text>
                        <TextInput ref={textInputRef} multiline allowFontScaling={false} style={[styles.modalPostText, ]} placeholder={gvoUser?.[0]?.bio} placeholderTextColor={gvoColors.dutchWhite} />
                    </View>
                    <TouchableOpacity onPress={handleSignOut}  activeOpacity={0.8} style={{display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems: "flex-start"}}>
                        <Text allowFontScaling={false} style={[styles.modalText, {width: "30%", marginRight: 10, color: gvoColors.azure}]}>Log out?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.footerButtonText}>Update</Text>
                </TouchableOpacity>
                </View>
            </View>   
            </KeyboardAvoidingView>
          {/* </SafeAreaView> */}
        </Modal>
      );
}

const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      height: '100%',
  
    },
    modalContainer: {
      width: '100%',
      height: '95%',
      backgroundColor: gvoColors.darkBackground,
      alignItems: 'center',
      padding: 10,
      position: 'absolute',
      bottom: 0,
      zIndex: 100,
    //   borderColor: gvoColors.semidark,
    //   borderTopWidth: 1,
    //   borderRadius: 10,
    },
    header: {
      width: '100%',
      padding: 30,
      borderBottomColor: gvoColors.semidark,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      width: '25%',
      alignItems: 'flex-start',
    },
    headerCenter: {
      width: '50%',
      alignItems: 'center',
    },
    headerRight: {
      width: '25%',
      alignItems: 'flex-end',
    },
    infoIcon: {
      backgroundColor: gvoColors.dutchWhite,
      borderRadius: 100,
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      width: '100%',
      height: '90%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    inputContainer: {
      width: '100%',
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 30,
    },
    personImage: {
      width: 35,
      height: 35,
      borderRadius: 50,
    },
    personImageStyle: {
      width: '100%',
      height: '100%',
      borderRadius: 100,
    },
    textInputWrapper: {
      width: '90%',
    },
    modalText: {
      fontSize: 18,
      color: gvoColors.dutchWhite,
      fontWeight: 'bold',
    },
    modalPostText: {
      fontSize: 18,
      color: gvoColors.dutchWhite,
      width: '55%',
      borderBottomColor: gvoColors.semidark,
      borderBottomWidth: 1,
      paddingBottom: 5
    },
    footer: {
      width: '100%',
      height: 40,
      alignItems: 'flex-end',
      paddingHorizontal: 15,
      position: 'absolute',
      bottom: 5,
    },
    closeButton: {
      borderRadius: 50,
      padding: 10,
      paddingHorizontal: 20,
      backgroundColor: gvoColors.maize,
    },
    footerButtonText: {
      color: gvoColors.azure,
      fontWeight: 'bold',
      fontSize: 16,
    },
    closeButtonText: {
      color: gvoColors.dutchWhite,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });