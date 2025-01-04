import { fontSizes } from "@/constants/Fontsizes"
import { View, Text } from "react-native"
import { router } from "expo-router"
import { gvoColors } from "@/constants/Colors"
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "@/types/type";
import { useGVOContext } from "@/constants/gvoContext";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
export default function Header () {
    const navigation = useNavigation<RootNavigationProp>(); // use typed navigation  
    const { setWantsToAuthenticate } = useGVOContext();
    const handleOpenModal = () => {
        setWantsToAuthenticate?.(true);
    }

    const {user} = useUser()

    return (
        <>
        <View style={{display: "flex", alignItems: "center", width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
            <Text allowFontScaling={false} onPress={() => {router.push("/")}} style={{fontWeight: "bold", fontSize: fontSizes.small, color: gvoColors.dutchWhite}}>GVO</Text>
            <SignedIn>
            <Text allowFontScaling={false} onPress={() => {}} style={{fontWeight: "bold", fontSize: fontSizes.small, color: gvoColors.dutchWhite}}>Log Out</Text>
            </SignedIn>
            <SignedOut>
                <Text allowFontScaling={false} onPress={() => {handleOpenModal()}} style={{fontWeight: "bold", fontSize: fontSizes.small, color: gvoColors.dutchWhite}}>Get Started</Text>
            </SignedOut>
        </View>
        </>
    )
}