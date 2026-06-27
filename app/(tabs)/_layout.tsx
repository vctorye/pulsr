import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, useColorScheme, TouchableOpacity } from "react-native";
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {user, token} = useAuth();
  const [profileData, setProfileData] = useState<any>(null)
  useEffect(() => {
    fetch(`http://localhost:3000/users/${user?.id}`, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => res.json())
    .then(data => setProfileData(data))
  }, [user])
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: true,
        headerLeft: () => (
            <View>
              {profileData?.profilePicture && <Image source={{ uri: profileData.profilePicture }} style={{ width: 30, height: 30, borderRadius: 15, marginBottom:15, marginLeft:15, 
                shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 10,
              }} />}
            </View>
          ),
        headerStyle:{backgroundColor: '#fcf1d3e9', height: 95},
        tabBarActiveTintColor: '#50a2fa',
        tabBarInactiveTintColor: '#5c5c5c78',
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          width: 330,
          borderRadius: 35,
          marginLeft: 36,
          height: 65,
          backgroundColor: '#fcf1d3e9',
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 4 },
          shadowOpacity: .3,
          shadowRadius: 10,
          elevation: 8,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Entypo name="home" size={16} color={color} />,
          headerRight: () => (
              <Link href="/add-friend" style={{ marginRight: 16 }}>
                <AntDesign name="user-add" size={24} color="black" />              
              </Link>
          ),
        }}
        
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <FontAwesome5 name="running" size={16} color={color} />,
        }}
      />

      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarIcon: ({ color }) => <FontAwesome6 name="bowl-food" size={16} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <AntDesign name="profile" size={16} color={color} />,
          headerShown:true,
          
          headerRight: () => (
              <Link href="/settings" style={{ marginRight: 16 }}>
                <Entypo name="dots-three-horizontal" size={24} color="black" />              
              </Link>
          ),
        }}
      />
    </Tabs>
  
  );
}
