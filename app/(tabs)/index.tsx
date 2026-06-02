import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function HomeScreen() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      fetch(`http://localhost:3000/friends/feed?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setPosts(data) });
    }, [user])
  );

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
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