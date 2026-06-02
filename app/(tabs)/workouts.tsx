import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

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

  const deleteExercise = (id) => {
    fetch(`http://localhost:3000/workouts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchData())
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={goBack}><Text>←</Text></TouchableOpacity>
        <Text>{selectedDate.toISOString().split('T')[0]}</Text>
        <TouchableOpacity onPress={goForward}><Text>→</Text></TouchableOpacity>
      </View>
      <View>
        <Text>Workout</Text>
        {workout.filter((w: any) => w.exercises.length > 0).map((w: any) => (
          <View key={w.id}>
            {w.exercises.map((e: any) => (
              <View key={e.id}>
                <Text key={e.id}>{e.name} — {e.sets}x{e.reps} @ {e.weight}lbs</Text>
                <TouchableOpacity onPress={() => deleteExercise(e.id)}><Text>x</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        <TextInput placeholder="Exercise name" value={exerciseName} onChangeText={setExerciseName} />
        <TextInput placeholder="Sets" value={sets === 0 ? '' : String(sets)} onChangeText={(val) => setSets(Number(val))} keyboardType="numeric" />
        <TextInput placeholder="Reps" value={reps === 0 ? '' : String(reps)} onChangeText={(val) => setReps(Number(val))} keyboardType="numeric" />
        <TextInput placeholder="Weight (lbs)" value={weight === 0 ? '' : String(weight)} onChangeText={(val) => setWeight(Number(val))} keyboardType="numeric" />
        <TouchableOpacity onPress={addWorkout}><Text>Add Exercise</Text></TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push({ pathname: '/post-workout'})}>
        <Text>Post Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});