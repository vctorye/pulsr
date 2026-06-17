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

  const deleteMeal = (id: any) => {
    fetch(`http://localhost:3000/meals/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchData())
  }

  const getMealByType = (type: string) => 
    meals.filter((m: any) => m.name === type);
  const totalCalories = meals.flatMap((m: any) => m.foodItems).reduce((sum: number, item: any) => sum + (item.calories ?? 0), 0);
  const remaining = (calorieCount ?? 0) - totalCalories;

  const renderSection = (type: string, label: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      {getMealByType(type).flatMap((m: any) => m.foodItems).map((item: any) => (
        <View key={item.id} style={styles.foodItemRow}>
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
      <Text style={[styles.calorieCount, { color: remaining < 0 ? 'red' : 'green' }]}>
        {calorieCount} cals - {totalCalories} cals = {remaining} cals 
      </Text>
      
      {renderSection('breakfast', 'Breakfast')}
      {renderSection('lunch', 'Lunch')}
      {renderSection('dinner', 'Dinner')}
      {renderSection('snack', 'Snack')}
      <TouchableOpacity style={styles.postMeal} onPress={() => router.push({ pathname: '/post-meal' })}>
        <Text style={styles.postMealText}>Add meal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor:'#fffbf0'},
  calorieCount: {fontSize: 18, padding: 20, backgroundColor: '#ffffffe0',fontWeight: 'bold', borderRadius: 8, marginBottom: 25, marginTop: 20, shadowColor: '#000', shadowOffset: {width: 1, height: 2}, shadowOpacity: 0.1, shadowRadius: 4} ,
  section: { marginBottom: 20, padding: 16, borderRadius: 12, backgroundColor: '#ffffff',shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: 0.1, shadowRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  foodItem: { fontSize: 14, paddingVertical: 4, color: '#000000' },
  foodItemRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: {width: 1, height: 1}, shadowOpacity: .25, shadowRadius: 2 

  },
  addBtn: { marginTop: 8 },
  addBtnText: { color: '#007AFF', fontWeight: '600' },
    postMeal: {
    backgroundColor: '#7c90e8', padding: 14, borderRadius: 10, alignItems: 'center', color: '#fff',
    marginLeft: 40,
    marginRight: 40
  },
  postMealText: {
    color: '#fff', 
    fontWeight: '600'
  },
});