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
                placeholder="Search for friends..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchInput}
            />
            <ScrollView>
                {filteredResults.map((u: any) => (
                    <View key={u.id} style={styles.resultRow}>
                        <View>
                            <Text style={styles.name}>{u.name}</Text>
                            <Text style={styles.email}>{u.email}</Text>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={() => {
                            setFriendId(u.id);
                            addFriend(u.id);
                        }}>
                            <Text style={styles.addButtonText}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fffbf0' },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4,
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4,
    },
    name: { fontWeight: 'bold', fontSize: 15 },
    email: { color: '#888', fontSize: 13, marginTop: 2 },
    addButton: {
        backgroundColor: '#50a2fa',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});