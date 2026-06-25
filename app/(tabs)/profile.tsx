import { StyleSheet, Text, View, ScrollView, Image, useColorScheme, TouchableOpacity } from "react-native";
import { useState, useEffect, useCallback } from "react";
import Colors from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useFocusEffect } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = makeStyles(colors);
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null)
  const [myPosts, setMyPosts] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);


  useEffect(() => {
    fetch(`http://localhost:3000/users/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setProfileData(data));
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      fetch(`http://localhost:3000/posts?userId=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setMyPosts(data.filter((p: any) => p.photoUrl).slice(0, 4)))

      fetch(`http://localhost:3000/friends?userId=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setFollowing(data))

    fetch(`http://localhost:3000/friends/followers?userId=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setFollowers(data))
    }, [user])
  )

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        {profileData?.profilePicture && <Image source={{ uri: profileData.profilePicture }} style={{ width: 90, height: 90, borderRadius: 45 }} />}
        <View>
          <Text style={styles.name}>{profileData?.name ?? '...'}</Text>
          <View style={{display:'flex', flexDirection: 'row', gap: 16}}>
            <TouchableOpacity onPress={() => router.push({ pathname: '/followers' })}><Text>{followers.length} followers</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push({ pathname: '/following' })}><Text>{following.length} following</Text></TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{display:'flex', flexDirection:'row', gap:5, marginRight:12, }}>
        {myPosts.map((p: any) => (
          <Image key={p.id} source={{ uri: p.photoUrl }} style={{ width: '25%', height: 100, borderRadius:4 }} />
        ))}
      </View>
      <TouchableOpacity style={styles.section} onPress={() => router.push({ pathname: '/activities' })}>
        <Feather name="activity" size={24} color="black" />
        <Text style={styles.sectionTitle}>Activities</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.section} onPress={() => router.push({ pathname: '/best-efforts' })}>
        <Ionicons name="trophy-outline" size={24} color="black" />
        <Text style={styles.sectionTitle}>Best efforts/PRs</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.section} onPress={() => router.push({ pathname: '/goals' })}>
        <Octicons name="goal" size={24} color="black" />
        <Text style={styles.sectionTitle}>Goals</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.section} onPress={() => router.push({ pathname: '/stats' })}>
        <Ionicons name="stats-chart" size={24} color="black" />
        <Text style={styles.sectionTitle}>Stats</Text>
      </TouchableOpacity>
      <Calendar
        style={{marginBottom:100}}
        onDayPress={day => {
          console.log('selected day', day);
        }}
      />
      <TouchableOpacity onPress={() => { logout(); router.replace('/login'); }} style={{ margin: 20, padding: 14, backgroundColor: '#ff3b30', borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Log Out</Text>
      </TouchableOpacity>
      <Calendar
        style={{marginBottom:100}}
        onDayPress={day => {
          console.log('selected day', day);
        }}
      />
    </ScrollView>
  );
}

const makeStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fdf8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 45,
    paddingVertical: 10,
    marginLeft:20
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12
  },
  section: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    gap: 12
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 12,
    color: colors.accent,
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.text,
  },
});
