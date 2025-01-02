import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Constants from 'expo-constants';
import { tokenCache } from '@/lib/auth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GVOProvider } from '@/constants/gvoContext';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Validate that all dummy parts exist
if (!Constants.expoConfig?.extra?.CLERK_KEY_DEV_1 ||!Constants.expoConfig?.extra?.CLERK_KEY_DEV_2) {
  console.log(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

// Extract dummy parts and salt from Expo config
const extra = Constants?.expoConfig?.extra;

const clerkKeyParts = [
  extra?.CLERK_KEY_DEV_1,
  extra?.CLERK_KEY_DEV_2
];

const reconstructKey = (parts: string[]) => parts.join("");

const publishableKey = reconstructKey(clerkKeyParts);


  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
    <GVOProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </GVOProvider>
    </ClerkLoaded>
    </ClerkProvider>
  );
}
