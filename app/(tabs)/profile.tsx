import { StyleSheet, Text, View, ScrollView, Image, useColorScheme, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import vicpfp from '../../assets/images/vic-pfp.png';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = makeStyles(colors);

  const mockUser = {
    name: 'Victor',
    email: 'victor@test.com',
    profilePicture: null,
    height: 72,
    weight: 205,
    weightGoal: 185,
    weeklyGoal: 1,
    age: 25,
    goal: 'Build Muscle',
    dailyCalorieGoal: 2800,
    activityLevel: 'active',
  };

  const mockPRs = {
    bench: 355,
    squat: 465,
    deadlift: 625,
    mile: '6:30',
    fiveK: '22:00',
    tenK: '46:00',
    halfMarathon: '1:45:00',
    marathon: null,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={vicpfp} style={styles.avatar} />
        <Text style={styles.name}>{mockUser.name}</Text>
        <TouchableOpacity onPress={() => console.log('settings pressed')}>
          <AntDesign name="setting" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lifting PRs</Text>
        <View style={styles.prRow}>
          <Text style={styles.text}>Squat: {mockPRs.squat} lbs</Text>
          <Text style={styles.text}>Bench: {mockPRs.bench} lbs</Text>
          <Text style={styles.text}>Deadlift: {mockPRs.deadlift} lbs</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Running PRs</Text>
        <View style={styles.prRow}>
          <Text style={styles.text}>Mile: {mockPRs.mile}</Text>
          <Text style={styles.text}>5K: {mockPRs.fiveK}</Text>
          <Text style={styles.text}>10K: {mockPRs.tenK}</Text>
        </View>
        <View style={styles.prRow}>
          <Text style={styles.text}>Half: {mockPRs.halfMarathon ?? 'TBD'}</Text>
          <Text style={styles.text}>Full: {mockPRs.marathon ?? 'TBD'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goals</Text>
        <View style={styles.prRow}>
          <Text style={styles.text}>Goal: {mockUser.goal}</Text>
          <Text style={styles.text}>Target: {mockUser.weightGoal} lbs</Text>
        </View>
        <View style={styles.prRow}>
          <Text style={styles.text}>Daily Calories: {mockUser.dailyCalorieGoal}</Text>
          <Text style={styles.text}>Pace: {mockUser.weeklyGoal} lbs/week</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
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
    backgroundColor: colors.card,
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
