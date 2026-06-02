import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";

export default function postWorkout() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [post, setPost] = useState<any>(null)

    const addPost = async () => {
        const res = await fetch(`http://localhost:3000/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user?.id,
                type: "workout"
            })
        });
        const data = await res.json();
        router.back()
    }
}