import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Touchable } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function addFriend() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [friendId, setFriendId] = useState<number | null>(null)
    const [myFriends, setMyFriends] = useState<any[]>([])

    useEffect(() => {
        if (!user?.id) return ;
        fetch(`http://localhost:3000/friends?userId=${user.id}`, {
            headers: {Authorization: `Bearer ${token}`}
        })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setMyFriends(data) })
    }, [user])
    const friendIds = myFriends.map(f => f.friendId);

    useEffect(() => {
        if (!searchQuery) return;
        const timer = setTimeout(() => {
            fetch(`http://localhost:3000/users/search?q=${searchQuery}&userId=${user?.id}`)
            .then(res => res.json())
            .then(data => setSearchResults(data))
            console.log('userId:', user?.id);
        }, 200)
        return () => clearTimeout(timer);
    }, [searchQuery])
    
    const filteredResults = searchResults.filter(u => !friendIds.includes(u.id));


    const addFriend = async (selectedFriendId: number) => {
        const res = await fetch(`http://localhost:3000/friends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user?.id,
                friendId:selectedFriendId
            })
        })
        const data = await res.json();
        router.back();
    }


    return(
        <View style={styles.container}>
            <TextInput
                placeholder="Search your friends"
                onChangeText={setSearchQuery}
                value={searchQuery}
            />
            <ScrollView>
                {filteredResults.map((u: any) => (
                    <View key={u.id}>
                        <Text>{u.name}</Text>
                        <Text>{u.email}</Text>
                        <TouchableOpacity onPress={() => {
                            setFriendId(u.id);
                            addFriend(u.id);
                        }}>
                            <Text>Add</Text>
                        </TouchableOpacity>
                    </View>
                    
                ))}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16},

});