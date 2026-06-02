import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = 'http://localhost:3000';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password || (mode === 'signup' && !name)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const body = mode === 'signup'
                ? { email, password, name }
                : { email, password };

            const res = await fetch(`${API_URL}/auth/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            console.log('login response:', data);

            if (!res.ok) {
                Alert.alert('Error', data.error || 'Something went wrong');
                return;
            }

            login(data.token, data.user);

            if (mode === 'signup' || !data.user.onboarded) {
                router.replace('/onboarding');
            } else {
                router.replace('/(tabs)');
            }
        } catch (e) {
            Alert.alert('Error', 'Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

        return (
        <View style={styles.container}>
            <Text style={styles.title}>Pulsr</Text>

            <View style={styles.toggle}>
                <TouchableOpacity
                    style={[styles.toggleBtn, mode === 'login' && styles.toggleActive]}
                    onPress={() => setMode('login')}
                >
                    <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, mode === 'signup' && styles.toggleActive]}
                    onPress={() => setMode('signup')}
                >
                    <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            {mode === 'signup' && (
                <TextInput style={styles.input} placeholder="Name"
                    value={name} onChangeText={setName} autoCapitalize="words" />
            )}

            <TextInput style={styles.input} placeholder="Email"
                value={email} onChangeText={setEmail}
                autoCapitalize="none" keyboardType="email-address" />

            <TextInput style={styles.input} placeholder="Password"
                value={password} onChangeText={setPassword} secureTextEntry />

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>
                    {loading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Sign Up'}
                </Text>
            </TouchableOpacity>
        </View>
    );
    
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 32, backgroundColor: '#fff' },
    title: { fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
    toggle: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 10, marginBottom: 24, padding: 4 },
    toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    toggleActive: { backgroundColor: '#fff' },
    toggleText: { color: '#888', fontWeight: '600' },
    toggleTextActive: { color: '#000' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 16 },
    button: { backgroundColor: '#000', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});