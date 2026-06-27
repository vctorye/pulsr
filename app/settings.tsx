import { StyleSheet, Text, View, ScrollView, Image, useColorScheme, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";   
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '@/lib/supabase';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from "react";


export default function Settings() {
    const {user, token} = useAuth();
    const router = useRouter();
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)

    const pickAndUploadImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });
    
        if (result.canceled) return;
    
        const file = result.assets[0];
        const fileName = `${user?.id}/${Date.now()}.jpg`;      
        console.log('fileName:', fileName);  
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
        console.log('url in handlepickimage', url)
        if (url) setPhotoUrl(url);
    }

    return(
        <View>
            <View>
                <Text>Edit Profile</Text>
                <TouchableOpacity>
                    <Image 
                        source={photoUrl ? { uri: photoUrl } : require('../assets/images/defaultpfp.jpg')} 
                        style={{width: 100, height: 100, borderRadius: 60}}
                    />
                    <FontAwesome6 name="add" size={24} color="black" 
                        style={{position: 'abosolute', bottom: 95, left: 50}}
                    />  
                </TouchableOpacity>
            </View>
            <View>
                <Text>Update Prs</Text>
            </View>
            <View>
                <Text>Update Goals</Text>
            </View>
            <View>
                <Text>Account Settings</Text>
            </View>
        </View>
    )
}