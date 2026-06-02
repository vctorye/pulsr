import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function MealsScreen() {
  const { user, token } = useAuth();
  const [meals, setMeals] = useState<any>([])
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calorieCount, setCalorieCount] = useState<number>()

  const fetchCalorieCount = () => {
    fetch (`http://localhost:3000/users/${user?.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setCalorieCount(data.dailyCalorieGoal))
  }

  const fetchData = useCallback(() => {
      if (!user?.id) return;
      const date = selectedDate.toISOString().split('T')[0];
      fetch(`http://localhost:3000/meals?userId=${user?.id}&date=${date}`, {
          headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
        console.log('meals data:', data);
        if (Array.isArray(data)) setMeals(data);
      });
      fetchCalorieCount();
    }, [user, selectedDate])

  useFocusEffect(fetchData)  

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

  const deleteMeal = (id) => {
    fetch(`http://localhost:3000/meals/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchData())
  }

  const getMealByType = (type: string) => 
    meals.filter(m => m.name === type);
  const totalCalories = meals.flatMap((m: any) => m.foodItems).reduce((sum: number, item: any) => sum + (item.calories ?? 0), 0);
  const remaining = (calorieCount ?? 0) - totalCalories;

  const renderSection = (type: string, label: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      {getMealByType(type).flatMap(m => m.foodItems).map((item: any) => (
        <View key={item.id}>
        <Text  style={styles.foodItem}>{item.name}</Text>
        <TouchableOpacity onPress={() => deleteMeal(item.id)}><Text>x</Text></TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addBtn} onPress={() => router.push({ pathname: '/food-search', params: { mealType: type } })}>
        <Text style={styles.addBtnText}>+ Add food</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={goBack}><Text>←</Text></TouchableOpacity>
        <Text>{selectedDate.toISOString().split('T')[0]}</Text>
        <TouchableOpacity onPress={goForward}><Text>→</Text></TouchableOpacity>
      </View>
      <Text style={{ color: remaining < 0 ? 'red' : 'green' }}>
        {remaining} cal remaining
      </Text>
      {renderSection('breakfast', 'Breakfast')}
      {renderSection('lunch', 'Lunch')}
      {renderSection('dinner', 'Dinner')}
      {renderSection('snack', 'Snack')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16},
  section: { marginBottom: 25, padding: 16, borderRadius: 12, backgroundColor: '#fafafa' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  foodItem: { fontSize: 14, paddingVertical: 4, color: '#333' },
  addBtn: { marginTop: 8 },
  addBtnText: { color: '#007AFF', fontWeight: '600' },
});