import { fontSizes } from "@/constants/Fontsizes"
import { View, Text } from "react-native"
import { router } from "expo-router"
import { gvoColors } from "@/constants/Colors"
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "@/types/type";
import { useGVOContext } from "@/constants/gvoContext";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useClerk } from '@clerk/clerk-react'
import { useEffect } from "react";

export default function Header () {
    const navigation = useNavigation<RootNavigationProp>(); // use typed navigation  
    const { gvoUserName, setWantsToAuthenticate } = useGVOContext();
    const { signOut } = useClerk()
    
    const handleOpenModal = () => {
        setWantsToAuthenticate?.(true);
    }

    const handleSignOut = async () => {
        try {
        router.push("/(tabs)/home")
        await signOut({
            
        })
        // Redirect to your desired page
        console.log('Signed out!')
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
      }
    }

    return (
        <>
        <View style={{display: "flex", alignItems: "center", width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
            <Text allowFontScaling={false} onPress={() => {router.push("/")}} style={{fontWeight: "bold", fontSize: fontSizes.small, color: gvoColors.dutchWhite}}>GVO</Text>
            <SignedIn>
                {/* <SignOutButton/> */}
                {/* <Text allowFontScaling={false} onPress={handleSignOut} style={{fontWeight: "bold", fontSize: fontSizes.small, color: gvoColors.dutchWhite}}>Log Out</Text> */}
                <Text allowFontScaling={false} onPress={() => {router.push("/myprofile")}} style={{fontWeight: "bold", fontSize: fontSizes.small, color: gvoColors.dutchWhite}}>{gvoUserName}</Text>
          </SignedIn>
            <SignedOut>
                <Text allowFontScaling={false} onPress={() => {handleOpenModal()}} style={{fontWeight: "bold", fontSize: fontSizes.small, color: gvoColors.dutchWhite}}>Get Started</Text>
            </SignedOut>
        </View>
        </>
    )
}