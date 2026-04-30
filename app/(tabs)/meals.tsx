import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

export default function profile() {
  const mockUser = {
    id: 1,
    name: 'Victor',
    email: 'victor@test.com',
    goal: 'build_muscle',
    dailyCalorieGoal: 2800,
  };

  const [user, setUser] = useState(mockUser);

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});