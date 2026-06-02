import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Touchable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker'
import { Image } from "react-native";
export default function postWorkout() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [post, setPost] = useState<any>(null)
    const [workout, setWorkout] = useState<any>([])
    const [cardio, setCardio] = useState<any>([])
    const [caption, setCaption] =useState<any>("")
    const today = new Date().toISOString().split('T')[0];
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setPhotoUrl(result.assets[0].uri);
        }
    }


    useEffect(() => {
        if (!user?.id) return
        fetch(`http://localhost:3000/workouts?userId=${user?.id}&date=${today}`, {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => res.json()).then(data => {if (Array.isArray(data)) setWorkout(data)})
    }, [user])
    const addPost = async () => {
        const res = await fetch(`http://localhost:3000/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user?.id,
                type: "workout",
                caption,
                photoUrl
            })
        });
        const data = await res.json();
        router.back()
    }

    return (
        <View style={styles.container}>
            <View>
                {workout.filter((w: any) => w.exercises.length > 0).map((w: any) => (
                    <View key={w.id}>
                        {w.exercises.map((e: any) => (
                            <View key={e.id}>
                                <Text>{e.name} — {e.sets}x{e.reps} @ {e.weight}lbs</Text>
                            </View>
                        ))}
            </View>
        ))}
            </View>
            <View style={styles.input}>
                <TextInput placeholder="Write a caption" value={caption} onChangeText={setCaption}/>
            </View>
            {photoUrl && <Image source={{ uri: photoUrl }} style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 16 }} />}
            <View style={styles.btnContainer}>
            
                <TouchableOpacity style={styles.btn} onPress={pickImage}>
                    <Text style={styles.btnText}>Pick Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => {addPost()}}>
                    <Text style={styles.btnText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex:1, padding: 20, paddingTop: 20, backgroundColor: '#fff'},
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 16 },
    btn: { flex:1,backgroundColor: '#007AFF', padding: 14, borderRadius: 10, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '600' },
    btnContainer: {display:'flex',flexDirection: 'row', justifyContent:'space-between', gap:16}

})