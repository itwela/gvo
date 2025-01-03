import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";

import { Button } from "react-native";
import { googleOAuth } from "@/lib/auth";
import { gvoColors } from "@/constants/Colors";
import { fontSizes } from "@/constants/Fontsizes";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = async () => {
    const result = await googleOAuth(startOAuthFlow);

    if (result.code === "session_exists") {
      Alert.alert("Success", "Session exists. Redirecting to home screen.");
      router.replace("/(tabs)/home");
    }

    Alert.alert(result.success ? "Success" : "Error", result.message);
  };

  return (
    <View style={{display: 'flex', alignItems: 'center', gap: 10, width: '100%'}}>
      
        <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.flexRowCenter, styles.border]}
        >

            {/* <Image
            source={icons.google}
            resizeMode="contain"
            style={styles.image}
            /> */}

        <TouchableOpacity onPress={handleGoogleSignIn}> 
          <Text style={{color: gvoColors.dutchWhite, fontSize: fontSizes.small}}>Continue with Google</Text>
        </TouchableOpacity>

        </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  border: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: gvoColors.dutchWhite,
    borderWidth: 1,
  },
  flexLine: {
    flex: 1,
    height: 1,
    backgroundColor: gvoColors.semidark,
    marginHorizontal: 16,
  },
  textLg: {
    fontSize: 18,
    color: gvoColors.dutchWhite,
  },
  button: {
    marginTop: 20,
    width: '100%',
    shadowOpacity: 0,
  },
  image: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
  },
});

export default OAuth;