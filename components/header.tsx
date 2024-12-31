import { fontSizes } from "@/constants/Fontsizes"
import { View, Text } from "react-native"
import { router } from "expo-router"
import { gvoColors } from "@/constants/Colors"

export default function Header () {
    return (
        <>
        <View style={{display: "flex", alignItems: "center", width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
            <Text onPress={() => {router.push("/")}} style={{fontWeight: "bold", fontSize: fontSizes.small}}>GVO</Text>
            <Text style={{fontWeight: "bold", fontSize: fontSizes.small}}>Admin</Text>
        </View>
        </>
    )
}