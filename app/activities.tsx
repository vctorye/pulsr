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
        <ScrollView>
            {posts.map((p: any) => {
            console.log(p)
           return (
                <View key={p.id}>
                    <Text>{p.user.name}</Text>
                    {p.photoUrl && <Image source={{ uri: p.photoUrl }} style={{ width: '70%', height: 150 }} />}                    
                    <Text>{p.caption}</Text>
                    <Text>{p.description}</Text>
                    <Text>{p.type}</Text>
                    <Text>{p.caption}</Text>
                </View>
            )})}
        </ScrollView>
    )
}