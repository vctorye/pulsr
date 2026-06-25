import { StyleSheet, Text, View, ScrollView, Image, useColorScheme, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";    

export default function Followers() {
    const {user, token} = useAuth();
    const router = useRouter();

    return(
        <View>
            <Text>hello</Text>
        </View>
    )
}