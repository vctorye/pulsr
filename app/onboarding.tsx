import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function OnboardingScreen() {
    const router = useRouter();
    const {user, token } = useAuth();

    const [step, setStep] = useState(1);

    //step1
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');

    //step2 
    const [goals, setGoals] = useState('');
      
    // Step 3 - PRs
    const [benchPR, setBenchPR] = useState('');
    const [squatPR, setSquatPR] = useState('');
    const [deadliftPR, setDeadliftPR] = useState('');
    const [milePR, setMilePR] = useState('');
    const [fiveKPR, setFiveKPR] = useState('');
    const [tenKPR, setTenKPR] = useState('');
    const [halfMarathonPR, setHalfMarathonPR] = useState('');
    const [marathonPR, setMarathonPR] = useState('');

    const handleSubmit = async() => {
        console.log('user:', user);
        console.log('token:', token);

        const res = await fetch(`http://localhost:3000/users/${user?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,      
            },
            body: JSON.stringify({
                height: Number(height),
                weight: Number(weight),
                age: Number(age),
                goal: goals,
                benchPR: Number(benchPR),
                squatPR: Number(squatPR),
                deadliftPR: Number(deadliftPR),
                milePR,
                fiveKPR,
                tenKPR,
                halfMarathonPR,
                marathonPR,
                onboarded: true,
            }),
        });
        if (res.ok) {
            router.replace('/(tabs)')
        }
    }

    return (
        <View style={styles.container}>
            {step === 1 && (
                <View>
                    <Text style={styles.title}>Basic Stats</Text>

                    <Text style={styles.label}>Height (inches)</Text>
                    <TextInput style={styles.input} value={height}
                        onChangeText={setHeight} keyboardType="numeric" placeholder="e.g. 72"  placeholderTextColor="#aaa"/>
                    
                    <Text style={styles.label}>Weight (lbs)</Text>
                    <TextInput style={styles.input} value={weight}
                        onChangeText={setWeight} keyboardType="numeric" placeholder="e.g. 185" placeholderTextColor="#aaa"/>

                    <Text style={styles.label}>Age</Text>
                    <TextInput style={styles.input} value={age}
                        onChangeText={setAge} keyboardType="numeric" placeholder="e.g. 25" placeholderTextColor="#aaa"/>
                    
                    <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            )}
            {step === 2 && (
                <View>
                    <Text style={styles.title}>What's your goal?</Text>

                    {['lose_weight', 'build_muscle', 'maintain'].map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[styles.optionBtn, goals===g && styles.optionBtnActive]}
                            onPress={() => setGoals(g)}
                        >
                            <Text style={[styles.optionText, goals===g && styles.optionTextActive]}>
                                {g === 'lose_weight' ? 'Lose Weight' : g === 'build_muscle' ? 'Build Muscle' : 'Maintain'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View> 
            )}
            {step === 3 && (
                <ScrollView>
                    <Text style={styles.title}>Personal Records</Text>

                    <Text style={styles.label}>Squat PR (lbs)</Text>
                    <TextInput style={styles.input} value={squatPR}
                        onChangeText={setSquatPR} keyboardType="numeric" placeholder="e.g. 225" placeholderTextColor="#aaa"/>
                        
                    <Text style={styles.label}>Bench PR (lbs)</Text>
                    <TextInput style={styles.input} value={benchPR}
                        onChangeText={setBenchPR} keyboardType="numeric" placeholder="e.g. 315" placeholderTextColor="#aaa"/>

                    <Text style={styles.label}>Deadlift PR (lbs)</Text>
                    <TextInput style={styles.input} value={deadliftPR}
                        onChangeText={setDeadliftPR} keyboardType="numeric" placeholder="e.g. 405" placeholderTextColor="#aaa"/>

                    <Text style={styles.label}>Mile PR (minutes and seconds)</Text>
                    <TextInput style={styles.input} value={milePR}
                        onChangeText={setMilePR} keyboardType="numeric" placeholder="e.g. 8:30" placeholderTextColor="#aaa"/>

                    <Text style={styles.label}>5k PR (minutes and seconds)</Text>
                    <TextInput style={styles.input} value={fiveKPR}
                        onChangeText={setFiveKPR} keyboardType="numeric" placeholder="e.g. 30:05" placeholderTextColor="#aaa"/>

                    <Text style={styles.label}>10k PR (hours, minutes and seconds)</Text>
                    <TextInput style={styles.input} value={tenKPR}
                        onChangeText={setTenKPR} keyboardType="numeric" placeholder="e.g. 1:03:40" placeholderTextColor="#aaa"/>
                    
                    <Text style={styles.label}>Half Marathon PR (hours, minutes and seconds)</Text>
                    <TextInput style={styles.input} value={halfMarathonPR}
                        onChangeText={setHalfMarathonPR} keyboardType="numeric" placeholder="e.g. 2:20:06" placeholderTextColor="#aaa"/>
                    
                    <Text style={styles.label}>Marathon PR (hours, minutes and seconds)</Text>
                    <TextInput style={styles.input} value={marathonPR}
                        onChangeText={setMarathonPR} keyboardType="numeric" placeholder="e.g. 4:20:10" placeholderTextColor="#aaa"/>
                    
                    <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                        <Text style={styles.buttonText}>Finish</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex:1, padding: 32, backgroundColor: "fff"},
    title: {fontSize: 28, fontWeight:'bold', marginBottom: 32,marginTop: 60},
    label: {fontSize: 14, fontWeight:'600', marginBottom: 6, color:'#555'},
    input: {borderWidth: 1, borderColor:'#ddd', borderRadius: 10, padding: 14 , marginBottom:20, fontSize: 16,},
    button: { backgroundColor: '#000', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    optionBtn: { borderWidth:2, borderColor: '#ddd', borderRadius: 10, padding: 16, marginBottom: 12},
    optionBtnActive: { backgroundColor: '#000 ', borderColor:'#000'},
    optionText: { fontSize: 16, fontWeight: '600', color: '#000', textAlign: 'center'},
    optionTextActive: {color: '$fff'},
    
})