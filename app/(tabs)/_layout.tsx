import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors, gvoColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthenticateModal } from '@/components/authModal';
import { useGVOContext } from '@/constants/gvoContext';
import { useUser } from '@clerk/clerk-expo';
import sql from '@/helpers/neonClient';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { wantsToAuthenticate, setWantsToAuthenticate } = useGVOContext();
  const { gvoUserName, setGvoUserName } = useGVOContext();
  const { user } = useUser();

  const handleCloseModal = () => {
    setWantsToAuthenticate?.(false);
  }

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          const response = await sql`SELECT * FROM users WHERE clerk_id = ${user.id}`;
          if (response.length > 0) {
            setGvoUserName?.(response[0].username);
            console.log("gvoUserName", response[0].username);
          } else {
            console.error("No user found with the given ID.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
  
    fetchUserName();
  }, [user]);

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: gvoColors.azure,
        tabBarInactiveTintColor: gvoColors.dutchWhite,
        headerShown: false,
        tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: gvoColors.dark,
            outlineStyle: 'none',
            borderColor: "transparent",
          },
          default: {
            backgroundColor: gvoColors.dark,
            outlineStyle: 'none',
            borderColor: "transparent",
          },
        }),
      }}>
      <Tabs.Screen
        name="home"
        options={{
          // title: 'Home',
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: '',
          // title: 'Connect',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: '',
          // title: 'Book',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar.badge.clock" color={color} />,
        }}
      />
      <Tabs.Screen
        name="myprofile"
        options={{
          // title: 'My Profile',
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
    <AuthenticateModal
      visible={wantsToAuthenticate === true}
      onClose={() => {handleCloseModal()}}
    />
    </>
  );
}
