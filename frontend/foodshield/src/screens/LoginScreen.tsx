import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/api";
import { RootRoutes } from "../navigation/Routes";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
  if (!email || !password) {
    Alert.alert("Login Failed", "Please enter email and password");
    return;
  }

  try {
    const res = await API.post("/auth/login", {
      email,
      password
    });

    await AsyncStorage.setItem("token", res.data.access_token);
    await AsyncStorage.setItem("user_id", String(res.data.user_id));

    // Alert.alert("Success", "Login successful 🎉");

    navigation.replace(RootRoutes.MainTabs);

  } catch (error: any) {

    if (error.response) {
      Alert.alert(
        "Login Failed",
        error.response.data.detail || "Invalid email or password"
      );
    } else {
      Alert.alert("Login Failed", "Network error. Please try again.");
    }

  }
};

  return (
    <View className="flex-1 bg-white justify-center p-6">

      <Text className="text-3xl font-bold mb-6 text-center">
        Welcome Back
      </Text>

      <TextInput
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
        className="border p-3 rounded-xl mb-4"
        placeholderTextColor="gray"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="gray"
        className="border text-black p-3 rounded-xl mb-6"
      />

      <TouchableOpacity
        onPress={login}
        className="bg-black py-4 rounded-xl items-center"
      >
        <Text className="text-white font-bold text-lg">
          LOGIN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        className="mt-4 items-center"
      >
        <Text className="text-blue-500">
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default LoginScreen;
