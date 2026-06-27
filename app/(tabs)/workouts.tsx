import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import postWorkout from "../post-workout";

export default function WorkoutScreen() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [workout, setWorkout] = useState<any>([])
  const [cardio, setCardio] = useState<any>([])
  const [sets, setSets] = useState<number>(0)
  const [reps, setReps] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
  const [exerciseName, setExerciseName] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())

  const goBack = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  }
  const goForward = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  }

  const addWorkout = async () => {
    const res = await fetch(`http://localhost:3000/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: user?.id,
        name: exerciseName,
        type: 'lifting',
        exercises: [{ name: exerciseName, sets, reps, weight }]
      })
    })
    setExerciseName('');
    setSets(0);
    setReps(0);
    setWeight(0);
    fetchData();
  }
  const fetchData = useCallback(() => {
    if (!user?.id) return;
    const date = selectedDate.toISOString().split('T')[0];
    fetch(`http://localhost:3000/workouts?userId=${user?.id}&date=${date}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(data => { if (Array.isArray(data)) setWorkout(data) });

    fetch(`http://localhost:3000/cardio?userId=${user?.id}&date=${date}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json()).then(data => { if (Array.isArray(data)) setCardio(data) });
  }, [user, selectedDate]);

  useFocusEffect(fetchData);

  const deleteExercise = (id: any) => {
    fetch(`http://localhost:3000/workouts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchData())
  }

  return (
    <View style={styles.container}>
      <View style={styles.date}>
        <TouchableOpacity onPress={goBack}><Text>←</Text></TouchableOpacity>
        <Text style={{fontSize: 26, fontWeight:900, color: '#2f2d2deb'}}>{selectedDate.toISOString().split('T')[0]}</Text>
        <TouchableOpacity onPress={goForward}><Text>→</Text></TouchableOpacity>
      </View>        
      <Text style={{fontSize:20, fontWeight:'bold', marginLeft: 30, color:'#50a2fa',}}>Workout</Text>

      <View style={styles.workoutContainer}>
        {workout.filter((w: any) => w.exercises.length > 0).map((w: any) => (
          <View key={w.id} style={styles.workoutList} >
            {w.exercises.map((e: any) => (
              <View  key={e.id} style={styles.exerciseContainer}>
                <Text key={e.id} style={styles.exerciseName}>{e.name} — {e.sets}x{e.reps} @ {e.weight}lbs</Text>
                <TouchableOpacity onPress={() => deleteExercise(e.id)}><Text>x</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        <View >
          <TextInput style={styles.inputList} placeholder="Exercise name" value={exerciseName} onChangeText={setExerciseName} />
          <TextInput style={styles.inputList} placeholder="Sets" value={sets === 0 ? '' : String(sets)} onChangeText={(val) => setSets(Number(val))} keyboardType="numeric" />
          <TextInput style={styles.inputList} placeholder="Reps" value={reps === 0 ? '' : String(reps)} onChangeText={(val) => setReps(Number(val))} keyboardType="numeric" />
          <TextInput style={styles.inputList} placeholder="Weight (lbs)" value={weight === 0 ? '' : String(weight)} onChangeText={(val) => setWeight(Number(val))} keyboardType="numeric" />
        </View>
        <TouchableOpacity onPress={addWorkout}><Text>Add Exercise</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.postWorkout}onPress={() => router.push({ pathname: '/post-workout'})}>
        <Text style={styles.postWorkoutText}>Post Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf8f8'
  },
  workoutContainer: {
    gap:10,
    padding: 30,
    backgroundColor: '#fdf8f8'
  },
  date: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16,
    padding:30,
    justifyContent: 'center'
  },
  exerciseName: {
    fontSize:18,
    color: '#fff',
    fontWeight: 'bold'
  },
  exerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#50a2fa',
    padding: 12,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: .05,
    shadowRadius: 3,
    elevation: 2,
  },
  postWorkout: {
    backgroundColor: '#fcf1d3e9', padding: 14, borderRadius: 10, alignItems: 'center', color: '#fff',
    marginLeft: 40,
    marginRight: 40,
    shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 0.3, shadowRadius: 2 
  },
  postWorkoutText: {
    color: '#ffffff', 
    fontWeight: '900',
    shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 0.3, shadowRadius: 8 
  },
  inputList: {
     marginBottom: 20, padding: 16, borderRadius: 12, backgroundColor: '#ffffff',shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 0.1, shadowRadius: 2 
  }
});