import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import API from "../utils/api";

const SignupScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allergenInput, setAllergenInput] = useState("");
  const [allergens, setAllergens] = useState<string[]>([]);

  const addAllergen = () => {
    if (allergenInput.trim() === "") return;
    setAllergens([...allergens, allergenInput.trim()]);
    setAllergenInput("");
  };

  const signup = async () => {
  let updatedAllergens = [...allergens];

  // Add last typed allergen if not added
  if (allergenInput.trim() !== "") {
    updatedAllergens.push(allergenInput.trim());
  }

  console.log("Sending allergens:", updatedAllergens);

  try {
    await API.post("/auth/signup", {
      username,
      email,
      password,
      allergens: updatedAllergens
    });

    Alert.alert("Success", "Account created successfully");
    navigation.navigate("Login");

  } catch (error: any) {
    Alert.alert("Error", error.response?.data?.detail || "Signup failed");
  }
};


  return (
    <ScrollView className="flex-1 bg-white p-6">

      <Text className="text-3xl font-bold mb-6 text-center">
        Create Account
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="gray"
        className="border p-3 rounded-xl mb-4"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="gray"
        className="border p-3 rounded-xl mb-4"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="gray"
        className="border p-3 rounded-xl mb-4"
      />

      {/* Allergens */}
      <Text className="font-bold mb-2">Add Allergens</Text>

      <View className="flex-row mb-4">
        <TextInput
          placeholder="Enter allergen"
          value={allergenInput}
          onChangeText={setAllergenInput}
          placeholderTextColor="gray"
          className="flex-1 border p-3 rounded-xl mr-2"
        />

        <TouchableOpacity
          onPress={addAllergen}
          className="bg-orange-500 px-4 justify-center rounded-xl"
        >
          <Text className="text-white font-bold">Add</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap mb-6">
        {allergens.map((item, index) => (
          <View
            key={index}
            className="bg-red-100 px-3 py-1 rounded-full mr-2 mb-2"
          >
            <Text className="text-red-600 font-semibold">
              {item}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={signup}
        className="bg-black py-4 rounded-xl items-center"
      >
        <Text className="text-white font-bold text-lg">
          SIGN UP
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        className="mt-4 items-center"
      >
        <Text className="text-blue-500">
          Already have an account? Login
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default SignupScreen;
