import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from 'expo-router';

export default function foodSearch() {
    const { user, token } = useAuth();
    const { mealType } = useLocalSearchParams();
    const router = useRouter();
    const [foodQuery, setFoodQuery] = useState('')
    const [foodItems, setFoodItems] = useState([]);
    const [expandedFoodId, setExpandedFoodId] = useState<any>(null)
    const [loggedFoodNutrients, setLoggedFoodNutrients] = useState({})

    
    useEffect(() => {
        {
            if (!foodQuery) return;
            const timer = setTimeout(() => {
                fetch(`http://localhost:3000/foods/search?q=${foodQuery}`)
                .then(res => res.json())
                .then(data => setFoodItems(data));
            }, 300)
            return () => clearTimeout(timer);
        }
    }, [foodQuery]) 

    const [foodDetails, setFoodDetails] = useState<any>(null);
    const [numberOfServings, setNumberOfServings] = useState(1);
    const servingSizeAmounts = (amount: number, servingSize: number, servings: number) => {
        return Math.round((amount / 100) * servingSize * servings);
    }
    useEffect(() => {
        if (!expandedFoodId) return;
        setFoodDetails(null);
        fetch(`http://localhost:3000/foods/${expandedFoodId}`)
            .then(res => res.json())
            .then(data => setFoodDetails(data));
    }, [expandedFoodId]);

    const addFood = async () => {
        console.log('mealType:', mealType);
        const calories = servingSizeAmounts(foodDetails.foodNutrients?.find((n: any) => n.nutrient.name === 'Energy')?.amount, foodDetails.servingSize, numberOfServings);
        const protein = servingSizeAmounts(foodDetails.foodNutrients?.find((n: any) => n.nutrient.name === 'Protein')?.amount, foodDetails.servingSize, numberOfServings);
        const carbs = servingSizeAmounts(foodDetails.foodNutrients?.find((n: any) => n.nutrient.name === 'Carbohydrate, by difference')?.amount, foodDetails.servingSize, numberOfServings);
        const fats = servingSizeAmounts(foodDetails.foodNutrients?.find((n: any) => n.nutrient.name === 'Total lipid (fat)')?.amount, foodDetails.servingSize, numberOfServings);

       const res =  await fetch('http://localhost:3000/meals', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user?.id,
                name: String(mealType),
                foodItems: [{ name: foodDetails.description, calories, protein, carbs, fats }]
            })
        });
        const data = await res.json();
        console.log('add food response:', data);
        router.back();
    }


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search for a food..."
                onChangeText={setFoodQuery}
                value={foodQuery}
                autoFocus
            />
            <ScrollView>
                {foodItems.map((food: any) => (
                    <View key={food.fdcId}>
                        <TouchableOpacity onPress={() => setExpandedFoodId(expandedFoodId === food.fdcId ? null : food.fdcId)}>
                            <Text style={styles.item}>{food.description}</Text>
                        </TouchableOpacity>

                        {expandedFoodId === food.fdcId && (
                            <View>
                                {foodDetails ? (
                                    <View>
                                        <Text>Calories: {servingSizeAmounts(foodDetails.foodNutrients?.find((n: any) => n.nutrient.name === 'Energy')?.amount, foodDetails.servingSize, numberOfServings)}</Text>
                                        <Text>Protein: {servingSizeAmounts(foodDetails.foodNutrients?.find((n: any) => n.nutrient.name === 'Protein')?.amount, foodDetails.servingSize, numberOfServings)}g</Text>
                                        <Text>Carbohydrate: {servingSizeAmounts(foodDetails.foodNutrients?.find((n: any) => n.nutrient.name === 'Carbohydrate, by difference')?.amount, foodDetails.servingSize, numberOfServings)}g</Text>
                                        <Text>Fat: {servingSizeAmounts(foodDetails.foodNutrients?.find((n: any) => n.nutrient.name === 'Total lipid (fat)')?.amount, foodDetails.servingSize, numberOfServings)}g</Text>
                                        <Text>Serving Size: {foodDetails.servingSize} {foodDetails.servingSizeUnit}</Text>

                                        <TextInput 
                                            style={styles.input}
                                            placeholder="Number of servings"
                                            onChangeText={(val) => setNumberOfServings(Number(val))}
                                            value={String(numberOfServings)}
                                            keyboardType="numeric"
                                        />
                                        <TouchableOpacity onPress={addFood}>
                                            <Text>Add</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <Text>Loading...</Text>
                                )}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 60 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 16 },
    item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', fontSize: 15, marginBottom: 2},
});