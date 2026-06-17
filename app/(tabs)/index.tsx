import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Image } from 'react-native';

export default function HomeScreen() {
  const router = useRouter()
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
<ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <TouchableOpacity onPress={() => router.push({ pathname: '/add-friend' })}>
        <Text>Add Friend</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push({ pathname: '/onboarding' })}>
        <Text>onboarding</Text>
      </TouchableOpacity>
      {posts.map((p: any) => (
        <View key={p.id} style={styles.workoutPost}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Image
              source={p.user.profilePicture ? { uri: p.user.profilePicture } : require('../../assets/images/defaultpfp.jpg')}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
            <Text style={{ fontWeight: 'bold' }}>{p.user.name}</Text>
            <Text style={{marginLeft: 'auto', fontSize:13, color:'#50a2fa'}}>{p.createdAt.split('T')[0]}</Text>
          </View>
          <Text style={styles.caption}>{p.caption}</Text>
          <Text style={styles.description}>{p.description}</Text>
          <Text style={{ color: '#999', fontSize: 12 , paddingBottom: 12}}>{p.type}</Text>
          {p.photoUrl && <Image source={{ uri: p.photoUrl }} style={{ width: '100%', height: 200, borderRadius: 8 , paddingBottom: 12}} />}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf0"
  },
  workoutPost: {
    backgroundColor: "#ffffff",
    padding:20,
    marginLeft:6,
    marginRight:6,
    borderRadius:6,
    marginBottom: 6,
    shadowColor: '#000', shadowOffset: {width: 1, height: 2}, shadowOpacity: .1, shadowRadius: 4,
  },
  description: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#black'
  },
  caption: {
    marginBottom: 16,
    marginTop:16
  }
});