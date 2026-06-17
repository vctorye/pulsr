import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from 'expo-image-picker'
import { Image } from "react-native";
import { supabase } from '@/lib/supabase';
import AntDesign from '@expo/vector-icons/AntDesign';
import defaultpfp from '../assets/defaultpfp.jpg'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
export default function OnboardingScreen() {
    const router = useRouter();
    const {user, token } = useAuth();

    const [step, setStep] = useState(1);

    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('')
    const [photoUrl, setPhotoUrl] = useState<string | null>(null)
    const [goals, setGoals] = useState('');
    const [username, setUsername] = useState('')
    const [birthday, setBirthday] = useState('')
    const [calorieGoal, setCalorieGoal] = useState(0)
    const [tdee, setTdee] = useState(0)
    const weightGoals = [
        {label: 'Maintain', deficit: 0},
        {label: 'Mild Weight Loss', deficit: 250},
        {label: 'Weight Loss', deficit: 500},
        {label: 'Extreme Weight Loss', deficit: 1000},
    ]
    const calculateTdee = () => {
        const weightKg = Number(weight) * 0.453592;
        const heightCm = Number(height) * 2.54;
        let bmr = 10 * weightKg + 6.25 * heightCm - 5 * Number(age) + 5
        if (gender === 'female') bmr -= 161
    
        const multipliers : Record<string, number> = {
            'Sedentary': 1.2,
            'Light': 1.375,
            'Moderate': 1.55,
            'Active': 1.725,
            'Very Active': 1.9,
            'Extra Active': 2.0,
        }
        const multiplier = multipliers[activityLevel] ?? 1.2;
        setTdee(Math.round(bmr * multiplier))
    }
    const [weightLoss, setWeightLoss] = useState('')
    const [activityLevel, setActivityLevel] = useState('')
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
                profilePicture: photoUrl,
                goal: goals,
                dailyCalorieGoal: calorieGoal,
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

    return (
        <ScrollView style={styles.container}>
            {step === 1 && (
                <View>
                    <Text style={styles.title}>Account</Text>
                        <TouchableOpacity onPress={handlePickImage} 
                            style={{alignItems: 'center'}}                       
                        >
                            <Image 
                                source={photoUrl ? { uri: photoUrl } : require('../assets/images/defaultpfp.jpg')} 
                                style={{width: 100, height: 100, borderRadius: 60}}
                            />
                            <FontAwesome6 name="add" size={24} color="black" 
                                style={{position: 'abosolute', bottom: 95, left: 50}}
                            />                        
                        </TouchableOpacity>
                         
                        <TextInput
                            style={styles.optionBtn}
                            onChangeText={setUsername}
                            placeholder="Username"
                        />
                        <TextInput
                            style={styles.optionBtn}
                            onChangeText={setBirthday}
                            placeholder="Birthday"
                        />
                        <Text style={styles.label}>Gender</Text>
                    <Picker
                        selectedValue={gender}
                        onValueChange={(itemValue) => setGender(itemValue)}                   
                    >
                        <Picker.Item label = "Male" value="male"/>
                        <Picker.Item label = "Female" value="female"/>

                    </Picker>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View> 
            )}
            {step === 2 && (
                <View >
                    <Text style={styles.title}>Basic Stats</Text>
                    

                    <Text style={styles.label}>Height (inches)</Text>
                    <Picker
                        selectedValue={height}
                        onValueChange={(itemValue) => setHeight(itemValue)}                   
                    >
                        {
                            Array.from({ length: 160 }, (_,i) => i + 45).map((h) => (
                                <Picker.Item label={`${h} inches`} value={String(h)}/>
                            ))
                        }

                    </Picker>
                    
                    <Text style={styles.label}>Weight (pounds)</Text>
                    <Picker
                        selectedValue={weight}
                        onValueChange={(itemValue) => setWeight(itemValue)}                   
                    >
                        {
                            Array.from({ length: 500 }, (_,i) => i + 48).map((h) => (
                                <Picker.Item label={`${h} pounds`} value={String(h)}/>
                            ))
                        }

                    </Picker>
                    <Text style={styles.label}>Age</Text>
                    <Picker
                        selectedValue={age}
                        onValueChange={(itemValue) => setAge(itemValue)}                   
                    >
                        {
                            Array.from({ length: 100 }, (_,i) => i + 16).map((h) => (
                                <Picker.Item label={`${h} years old`} value={String(h)}/>
                            ))
                        }

                    </Picker>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setStep(1)}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            
            {step === 3 && (
                <View>
                    <Text style={styles.title}>What's your activity level?</Text>
                    {['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active', 'Extra Active'].map((a) => (
                        <TouchableOpacity
                            key={a}
                            style={[styles.optionBtn,  activityLevel === a && styles.optionBtnActive]}
                            onPress={() => setActivityLevel(a)}
                        >
                            <Text style={styles.optionText}>
                                {a}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {setStep(4); calculateTdee()}}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {step === 4 && (
                <View>
                    <Text style={styles.title}>Choose your goal</Text>
                    {weightGoals.map((g) => (
                        <TouchableOpacity
                            key={g.label}
                            style={[styles.optionBtn,  weightLoss === g.label && styles.optionBtnActive]}
                            onPress={() => {setWeightLoss(g.label); setCalorieGoal(tdee- g.deficit)}}
                        >
                            <Text style={styles.optionText}>
                                {g.label}
                            </Text >
                            { weightLoss === g.label && 
                                <Text style={styles.optionText }>
                                    {tdee - g.deficit} calories 
                                </Text>
                            }
                        </TouchableOpacity>
                    ))}
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setStep(5)}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {step === 5 && (
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
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                            <Text style={styles.buttonText}>Finish</Text>
                        </TouchableOpacity>
                    </View>                        
                </ScrollView>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex:1, padding: 32, backgroundColor: "#fdf8f8"},
    title: {fontSize: 28, fontWeight:'bold', marginBottom: 32,marginTop: 60},
    label: {fontSize: 14, fontWeight:'600', marginBottom: 6, color:'#555'},
    input: {borderWidth: 1, borderColor:'#ddd', borderRadius: 10, padding: 14 , marginBottom:20, fontSize: 16,},
    button: { backgroundColor: '#000', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8,flex:1 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    optionBtn: { borderWidth:2, borderColor: '#ddd', borderRadius: 10, padding: 16, marginBottom: 12},
    optionBtnActive: { backgroundColor: '#000 ', borderColor:'#000'},
    optionText: { fontSize: 16, fontWeight: '600', color: '#000', textAlign: 'center'},
    optionTextActive: {color: '$fff'},
    btnContainer: {flexDirection: 'row',justifyContent: 'space-between', gap:8}
})