import { StyleSheet, Text, View, ScrollView, Image, useColorScheme, TouchableOpacity} from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router"; 

export default function Activites() {
    const {user, token} = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([])
    useEffect(() => {
        if (!user?.id) return;

        fetch(`http://localhost:3000/posts/?userId=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setPosts(data));
    }, [user])
    return(
        <ScrollView style={styles.container}>
            {posts.map((p: any) => {
            console.log(p)
           return (
                <View key={p.id} style={styles.workoutPost}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>{p.user.name}</Text>
                        <Text style={{marginLeft: 'auto', fontSize:13, color:'#50a2fa'}}>{p.createdAt.split('T')[0]}</Text>
                    </View>
                    {p.photoUrl && <Image source={{ uri: p.photoUrl }} style={{ width: '100%', height: 200, borderRadius: 8 , paddingBottom: 12}}/>}                    
                    <Text style={styles.description}>{p.description}</Text>
                    <View style={{ 
                        backgroundColor: p.type === 'workout' ? '#50a2fa' : '#f4a261',
                        paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 14
                    }}>
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{p.type.charAt(0).toUpperCase() + p.type.slice(1)}</Text>
                    </View>
                </View>
            )})}
        </ScrollView>
    )
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