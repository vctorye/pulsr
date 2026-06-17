import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Touchable } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker'
import { Image } from "react-native";
import { supabase } from '@/lib/supabase';

export default function postMeal() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [post, setPost] = useState<any>(null);
    const [caption, setCaption] = useState<any>("");
    const today = new Date().toISOString().split('T')[0];
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [ingredients, setIngredients] = useState<any>([])
    const [description, setDescription] = useState<any>([])

    const pickAndUploadImage = async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            });
    
            if (result.canceled) return;
    
            const file = result.assets[0];
            const fileName = `${user?.id}/${Date.now()}.jpg`;      
            const response = await fetch(file.uri);
            const arrayBuffer = await response.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
    
            const { data, error } = await supabase.storage
                .from('posts')
                .upload(fileName, bytes, { contentType: 'image/jpeg' });
    
            if (error) { console.log('upload error:', JSON.stringify(error)); return; }
            
            const { data: { publicUrl } } = supabase.storage
                .from('posts')
                .getPublicUrl(fileName);
            console.log('publicUrl:', publicUrl);
    
            return publicUrl;
        };

        const handlePickImage = async () => {
        const url = await pickAndUploadImage();
        if (url) setPhotoUrl(url);
    }

    useEffect(() =>{
        if (!user?.id) return
        const date = today.split('T')[0];
        fetch(`http://localhost:3000/meals?userId=${user?.id}&date=${date}`, {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then(res => res.json())
        .then(data => {if (Array.isArray(data)) setIngredients(data) })
            
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
                type: "meal",
                caption,
                photoUrl,
                description: description.map((item: any) => item.name).join(', ')
            })
        });
        const data = await res.json();
        router.back()
    }
    const addFoodItem = (item: any) => {
        setDescription((prev: any) => [...prev, item]);
    }

    return(
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
            {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                const items = ingredients.filter((m: any) => m.name === mealType).flatMap((m: any) => m.foodItems);
                if (items.length === 0) return null;
                return (
                    <View key={mealType} style={{ marginBottom: 16 }}>
                        <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{mealType}</Text>
                        {items.map((item: any) => (
                            <TouchableOpacity key={item.id} onPress={() => addFoodItem(item)}>
                                <Text>
                                    {item.name} — {item.calories} cal | P: {item.protein}g  C: {item.carbs}g  F: {item.fats}g
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            })}
            <View> 
                <TextInput placeholder="Write a caption" value={caption} onChangeText={setCaption}/>
                <View>
                    <Text>Your food items for the meal</Text>
                    {description.map((item: any) => (
                        <Text key={item.name} >{item.name}</Text>
                    ))}
                </View>
                {photoUrl && <Image source={{ uri: photoUrl }} style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 16 }} />}
                <TouchableOpacity  onPress={handlePickImage}>
                    <Text>Pick Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addPost}>
                    <Text>Post Meal</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}