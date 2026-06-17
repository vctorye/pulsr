import { StyleSheet, Text, View, ScrollView, Image, useColorScheme, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = makeStyles(colors);
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null)
  

  useEffect(() => {
    fetch(`http://localhost:3000/users/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setProfileData(data));
}, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {profileData?.profilePicture && <Image source={{ uri: profileData.profilePicture }} style={{ width: 90, height: 90, borderRadius: 45 }} />}

        <Text style={styles.name}>{profileData?.name ?? '...'}</Text>
        <TouchableOpacity onPress={() => console.log('settings pressed')}>
          <AntDesign name="setting" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lifting PRs</Text>
        <View style={styles.prRow}>
          <Text style={styles.text}>Squat: {profileData?.squatPR ?? 'TBD'} lbs</Text>
          <Text style={styles.text}>Bench: {profileData?.benchPR ?? 'TBD'} lbs</Text>
          <Text style={styles.text}>Deadlift: {profileData?.deadliftPR ?? 'TBD'} lbs</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Running PRs</Text>
        <View style={styles.prRow}>
          <Text style={styles.text}>Mile: {profileData?.milePR ?? 'TBD'}</Text>
          <Text style={styles.text}>5K: {profileData?.fiveKPR ?? 'TBD'}</Text>
          <Text style={styles.text}>10K: {profileData?.tenKPR ?? 'TBD'}</Text>
        </View>
        <View style={styles.prRow}>
          <Text style={styles.text}>Half: {profileData?.halfMarathonPR ?? 'TBD'}</Text>
          <Text style={styles.text}>Full: {profileData?.marathonPR ?? 'TBD'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goals</Text>
        <View style={styles.prRow}>
          <Text style={styles.text}>Goal: {profileData?.goal ?? 'TBD'}</Text>
          <Text style={styles.text}>Target: {profileData?.weightGoal ?? 'TBD'} lbs</Text>
        </View>
        <View style={styles.prRow}>
          <Text style={styles.text}>Daily Calories: {profileData?.dailyCalorieGoal ?? 'TBD'}</Text>
          <Text style={styles.text}>Pace: {profileData?.weeklyGoal ?? 'TBD'} lbs/week</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => { logout(); router.replace('/login'); }} style={{ margin: 20, padding: 14, backgroundColor: '#ff3b30', borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const makeStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fdf8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 55,
    paddingVertical: 16,
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
  },
  section: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fdfdfd",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
