import { Modal, Alert, View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { gvoColors } from '@/constants/Colors';
import { fontSizes } from '@/constants/Fontsizes';
import { buttonStyle, faq, faqquestions } from '@/constants/tokens';
import { KeyboardAvoidingView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useCallback } from "react";
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import OAuth from './OAuth';
import { useGVOContext } from '@/constants/gvoContext';
import { useSignUp } from '@clerk/clerk-expo'
import ReactNativeModal from "react-native-modal";
import sql from "@/helpers/neonClient";

export const AuthenticateModal = ({ visible, onClose }: { visible: boolean; onClose: () => void; }) => {

    const { signIn, setActive: setActiveSignIn, isLoaded: isLoadedSignIn } = useSignIn();
    const { signUp, setActive: setActiveSignUp, isLoaded: isLoadedSignUp } = useSignUp();
    const { wantsToLogIn, wantsToSignUp, setWantsToLogIn, setWantsToSignUp, setWantsToAuthenticate } = useGVOContext();

    const isLoaded = wantsToSignUp ? isLoadedSignUp : isLoadedSignIn;
    const setActive = wantsToSignUp ? setActiveSignUp : setActiveSignIn;
    const router = useRouter()
    const [showSuccessModal, setShowSuccessModal] = useState(false)


    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        adminCode: '',
    })

    const [verification, setVerification] = useState({
        state: 'default',
        error: '',
        code: '',
      })

    const onSignInPress = useCallback(async () => {
        if (!isLoaded) return;
    
        try {
          const signInAttempt = await signIn?.create({
            identifier: form.email,
            password: form.password,
          });
    
          if (signInAttempt?.status === "complete") {
            await setActive?.({ session: signInAttempt.createdSessionId });
            setForm({
                name: '',
                email: '',
                password: '',
                adminCode: '',
            })
            onClose();
            router.push("/(tabs)/home");
          } else {
            // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
            console.log(JSON.stringify(signInAttempt, null, 2));
            Alert.alert("Error", "Log in failed. Please try again.");
          }
        } catch (err: any) {
          console.log(JSON.stringify(err, null, 2));
          Alert.alert("Error", err.errors[0].longMessage);
        }
    }, [isLoaded, form.email, form.password]);
  
    const onSignUpPress = async () => {
        if (!isLoaded) return;
        try {
          await signUp?.create({
            emailAddress: form.email,
            password: form.password,
          });
          await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
          setVerification({
            ...verification,
            state: "pending",
          });
        } catch (err: any) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.log(JSON.stringify(err, null, 2));
          Alert.alert("Error", err.errors[0].longMessage);
        }
      };
    const onPressVerify = async () => {
    if (!isLoaded) return;

    try {

        const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code: verification.code,
        });

        console.log("completeSignUp", completeSignUp)

        if (completeSignUp?.status === "complete") {
        
        const role = form.adminCode === 'NARQSWORLD' ? 'admin' : 'user'
        const image = 'https://images.pexels.com/photos/8058392/pexels-photo-8058392.jpeg?auto=compress&cs=tinysrgb&w=1200'
        const bio = ""

        const createdUserResponse = await sql`
        INSERT INTO users (
            name,
            email,
            password,
            role,
            username,
            user_img_url,
            bio,
            clerk_id,
            admin_code
        )
        VALUES (
            ${form.name},
            ${form.email},
            ${form.password},
            ${role},
            ${form.name},
            ${image},
            ${bio},
            ${completeSignUp.createdUserId},
            ${form.adminCode}
        )
        RETURNING *;
        `;

        await setActive?.({ session: completeSignUp.createdSessionId });

        setVerification({
            ...verification,
            state: "success",
        });

        console.log("verified", verification.state)

        } else {
        setVerification({
            ...verification,
            error: "Verification failed. Please try again.",
            state: "failed",
        });
        }
    } catch (err: any) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
        });
    }
    };

    const handleCompleteSignUp = async () => {
        setForm({name: "", email: "", password: "", adminCode: ""});
        setShowSuccessModal(false);
        // router.replace("/(tabs)/myprofile")
        // onClose();
        // setWantsToAuthenticate?.(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                <ScrollView style={{width: '100%'}}>
                    <View style={{height: 20}}/> 
                    <View style={{width: '100%', height: 20, flexDirection: 'row', alignContent: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        
                        <Text style={{ color: gvoColors.dutchWhite, fontSize: fontSizes.small, fontWeight: 'bold' }}>GVO</Text>
                        <TouchableOpacity onPress={() => { setForm({name: '', email: '', password: '', adminCode: ''}); onClose();}}>
                            <Text style={{ color: gvoColors.dutchWhite, fontSize: fontSizes.small }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAvoidingView behavior="padding" style={{width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: "transparent",}} keyboardVerticalOffset={10}>

                        {wantsToLogIn == true && (
                            <>
                                <View style={{width: "100%", paddingTop: 20, alignItems: "flex-start", display: "flex", flexDirection: "column", gap: 10 }}>
                                    <View style={{width: "100%", display: "flex", flexDirection: "row"}}>
                                    <TouchableOpacity  style={{width: "20%", height: 10, backgroundColor: gvoColors.dutchWhite, borderRadius: 10}} activeOpacity={0.9}>
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={{width: "80%", height: 10, backgroundColor: gvoColors.azure, borderRadius: 10}} activeOpacity={0.9}>
                                    </TouchableOpacity>
                                    </View>
                                    <View/>
                                    <Text style={[styles.heading, {color: gvoColors.dutchWhite}]}>Log in</Text>
                                </View>
                                            
                                <View style={{ 
                                    width: '100%', 
                                    paddingTop: 20,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 15
                                }}>

                            
                                    <TextInput 
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChangeText={(text) => setForm({ ...form, email: text })}
                                    style={styles.inputBar}
                                    placeholderTextColor={gvoColors.dutchWhite}
                                    />
                                
                                    <TextInput 
                                    placeholder="Enter your password"
                                    value={form.password}
                                    secureTextEntry={true}
                                    onChangeText={(text) => setForm({ ...form, password: text })}
                                    style={styles.inputBar}
                                    placeholderTextColor={gvoColors.dutchWhite}
                                    />


                                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: 15, marginVertical: 30}}>
                                    
                                    <TouchableOpacity onPress={onSignInPress} activeOpacity={0.9} style={styles.button}>
                                    
                                    <Text style={[buttonStyle.mainButtonText, {color: gvoColors.dutchWhite}]}>Log In</Text>
                                    
                                    </TouchableOpacity>

                                    <OAuth />

                                    <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10}}>

                                    <Text style={[styles.option, {color: '#999999'}]}>Don't have an account?</Text>
                                    
                                    <TouchableOpacity  onPress={() => { setWantsToSignUp?.(true); setWantsToLogIn?.(false); }}>
                                        <Text style={{color: gvoColors.azure, fontSize: 20}}>Sign up</Text>
                                    </TouchableOpacity>
                                    
                                    </View>
                                
                                </View>

                                </View>
                            </>
                        )}

                        {wantsToSignUp == true && (
                            <>
                            <View style={{width: "100%", alignItems: "flex-start", display: "flex", flexDirection: "column", gap: 10, }}>
                                <View style={{width: "100%", paddingTop: 20, display: "flex", flexDirection: "row"}}>
                                    <TouchableOpacity onPress={ ()  => { }}  style={{width: "20%", height: 10, backgroundColor: gvoColors.dutchWhite, borderRadius: 10}} activeOpacity={0.9}>
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={{width: "80%", height: 10, backgroundColor: gvoColors.azure, borderRadius: 10}} activeOpacity={0.9}>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.heading, {color: gvoColors.dutchWhite}]}>Sign-Up</Text>
                                </View>
                            
                                <View style={{ 
                                width: '100%', 
                                minHeight: '100%', 
                                paddingTop: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 15
                            }}>

                                
                                <TextInput 
                                placeholder="Enter your name"
                                value={form.name}
                                onChangeText={(text) => setForm({ ...form, name: text })}
                                style={styles.inputBar}
                                placeholderTextColor={gvoColors.dutchWhite}
                                />
                        
                                <TextInput 
                                placeholder="Enter your email"
                                value={form.email}
                                onChangeText={(text) => setForm({ ...form, email: text })}
                                style={styles.inputBar}
                                placeholderTextColor={gvoColors.dutchWhite}
                                />
                            
                                <TextInput 
                                placeholder="Enter your password"
                                value={form.password}
                                secureTextEntry={true}
                                onChangeText={(text) => setForm({ ...form, password: text })}
                                style={styles.inputBar}
                                placeholderTextColor={gvoColors.dutchWhite}
                                />

                                <Text style={[styles.option, {color: '#999999'}]}>Have an admin code?</Text>
                                <TextInput 
                                placeholder="Enter your admin code"
                                value={form.adminCode}
                                onChangeText={(text) => setForm({ ...form, adminCode: text })}
                                style={styles.inputBar}
                                placeholderTextColor={gvoColors.dutchWhite}
                                />

                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: 15, marginVertical: 15}}>
                                
                                
                                    <TouchableOpacity onPress={onSignUpPress} activeOpacity={0.9} style={styles.button}>
                                    
                                    <Text style={[buttonStyle.mainButtonText, {color: gvoColors.dutchWhite}]}>Sign Up</Text>
                                
                                    </TouchableOpacity>


                                <OAuth />

                                <View style={{width: "100%", alignItems: "center", display: "flex", flexDirection: "column", gap: 1}}>

                                    <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10}}>

                                    <Text style={[styles.option, {color: '#999999'}]}>Already have an account?</Text>
                                    <TouchableOpacity  onPress={() => { setWantsToSignUp?.(false); setWantsToLogIn?.(true); setForm({name: "", email: "", password: "", adminCode: ""}); }}>
                                        <Text style={{color: gvoColors.azure,  fontSize: 20}}>Log in</Text>
                                    </TouchableOpacity>
                            
                                    </View>

                                </View>


                                        
                            </View>


                            <ReactNativeModal 
                                isVisible={verification.state === "pending"} 
                                onModalHide={async () => {
                                console.log("Verification modal hidden", verification.state);
                            
                                if (verification.state === "success") {
                                    // Simulate an async operation (e.g., fetching data or waiting for something)
                                    await new Promise((resolve) => setTimeout(resolve, 100)); // Example delay
                                    setShowSuccessModal(true);
                                    console.log("if statement ran", verification.state);
                                    console.log(showSuccessModal);
                                }
                                }}
                                >
                                
                                <View style={styles.modalView}>

                                <View style={{width: "100%", display: "flex",  flexDirection: "column"}}>
                                    <Text style={[styles.option, {fontWeight: 'bold', color: gvoColors.dutchWhite}]}>Verification</Text>
                                    <Text style={{marginBottom: 0, color: gvoColors.dutchWhite, fontStyle: 'italic'}}>We've sent a code to {form.email}. Please enter it below.</Text>
                                </View>
                                
                                <View style={{width: "100%", height: 80}}>
                                    <TextInput
                                    placeholder="12345"
                                    value={verification.code}
                                    keyboardType="numeric"
                                    onChangeText={(code) => setVerification({ ...verification, code })}
                                    placeholderTextColor={gvoColors.dutchWhite}
                                    style={styles.inputBar}
                                    numberOfLines={1}
                                    />
                                </View>

                                <View style={{width: "100%", display: "flex", flexDirection: "column"}}>
                                    
                                    {verification.error && (
                                    <Text style={{color: 'red'}}>{verification.error}</Text>
                                    )}

                                    <TouchableOpacity style={[buttonStyle.mainButton, {marginTop: 10}]} onPress={onPressVerify}>
                                    <Text style={[buttonStyle.mainButtonText, {color: gvoColors.dutchWhite}]}>Verify Email</Text>
                                    </TouchableOpacity>

                                </View>
                                </View>

                            </ReactNativeModal>

                            <ReactNativeModal isVisible={showSuccessModal === true}>
                                
                                <View style={styles.modalView}>
                                {/* <Image source={icons.check} style={styles.modalImage}/> */}
                                <Text style={[styles.option, {textAlign: 'center', color: gvoColors.dutchWhite, fontWeight: 'bold'}]}>Verified ✅</Text>
                                <Text style={{textAlign: 'center', marginBottom: 20, color: gvoColors.dutchWhite, fontStyle: 'italic'}}>You have successsfully verified your account.</Text>
                                <TouchableOpacity style={buttonStyle.mainButton} 
                                onPress={() => {
                                    handleCompleteSignUp();
                                }}>
                                    <Text style={[buttonStyle.mainButtonText, {color: gvoColors.dutchWhite}]}>Close</Text>
                                </TouchableOpacity>
                                </View>

                            </ReactNativeModal>

                                </View>
                            </>
                        )}

                    </KeyboardAvoidingView>

                </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      height: '100%',
    },
    inputBar: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: gvoColors.semidark,
        padding: 10,
        color: gvoColors.dutchWhite
    },
    modalContainer: {
      width: '100%',
      height: '85%',
      backgroundColor: gvoColors.darkBackground,
      alignItems: 'flex-start',
      paddingHorizontal: 30,
      position: 'absolute',
      bottom: 0,
      zIndex: 100,
    },
    modalView: {
        backgroundColor: gvoColors.dark,
        paddingHorizontal: 28,
        paddingVertical: 20,
        borderRadius: 20,
        minHeight: 300,
        display: 'flex',
        justifyContent: "space-between"
  ,    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        fontSize: 60,
        fontWeight: 'bold',
      },
      button: {
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignContent: 'center', 
        alignItems: 'center', 
        backgroundColor: gvoColors.azure, 
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
      },
      heading: {
        fontSize: 45,
        fontWeight: 'bold',
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
      },
      option: {
        fontSize: 20,
        paddingVertical: 10,
      },
      separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
      },
});  