import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Image } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default function HomeScreen() {
  const router = useRouter()
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [comment, setComment] = useState<any>('')

  const fetchFeed = () => {
    if (!user?.id) return;
    fetch(`http://localhost:3000/friends/feed?userId=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPosts(data) });
  }

  const likePost = (postId: number) => {
    fetch(`http://localhost:3000/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId: user?.id, postId })
    }).then(() => fetchFeed())
  }

  const commentPost = (postId: number) => {
    fetch(`http://localhost:3000/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId: user?.id, postId, text: comment })
    }).then(() => { setComment(''); fetchFeed() })
  }

  useFocusEffect(
    useCallback(() => {
      fetchFeed();
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
          <View style={{ 
              backgroundColor: p.type === 'workout' ? '#50a2fa' : '#f4a261',
              paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 14
          }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{p.type.charAt(0).toUpperCase() + p.type.slice(1)}</Text>
          </View>
          {p.photoUrl && <Image source={{ uri: p.photoUrl }} style={{ width: '100%', height: 200, borderRadius: 8 , paddingBottom: 12}} />}
          {p.likes?.length > 0 && <Text style={{marginBottom:10}}>{p.likes.length} likes</Text>}
          <View style={styles.interactions}>
            <TouchableOpacity onPress={() => likePost(p.id)}>
              <SimpleLineIcons name="like" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name="comment-processing-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome5 name="share" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {p.comments?.map((c: any) => (
            <View key={c.id} style={{ flexDirection: 'row', gap: 6, marginBottom: 4, marginTop:14 }}>
              <Text style={{ fontWeight: 'bold' }}>{c.user.name}:</Text>
              <Text style={{marginLeft:4}}>{c.text}</Text>
            </View>
          ))}
          <View style={{ display: 'flex', flexDirection: 'row' , marginTop: 12, justifyContent: 'space-between', }}>
            <TextInput placeholder="Add a comment..." value={comment} onChangeText={setComment} />
            <TouchableOpacity onPress={() => commentPost(p.id)}>
              <Ionicons name="arrow-up-circle-sharp" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
    marginBottom: 14,
    color: '#000',
    fontSize: 18
  },
  caption: {
    marginBottom: 16,
    marginTop:16
  },
  interactions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 30,
    marginLeft: 30
  }
});