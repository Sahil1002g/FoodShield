import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/api";
import { RootRoutes } from "../navigation/Routes";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

const AccountScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [allergenInput, setAllergenInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      const allergens = Array.isArray(res.data.allergens)
        ? res.data.allergens
        : [];
      setUser({ ...res.data, allergens });
    } catch (error) {
      console.log(error);
    }
  };

  const saveAllergens = async (allergens: string[]) => {
    setSaving(true);
    try {
      const response = await API.put("/user/allergens", { allergens });
      setUser((current: any) => ({
        ...current,
        allergens: response.data.allergens,
      }));
      setAllergenInput("");
      setEditingIndex(null);
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.response?.data?.detail || "Could not update allergens",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllergen = async () => {
    const value = allergenInput.trim();
    if (!value) {
      Alert.alert("Allergen Required", "Please enter an allergen");
      return;
    }

    const currentAllergens: string[] = user.allergens ?? [];
    const duplicateIndex = currentAllergens.findIndex(
      (item) => item.trim().toLowerCase() === value.toLowerCase(),
    );

    if (duplicateIndex !== -1 && duplicateIndex !== editingIndex) {
      Alert.alert("Already Added", `${value} is already in your allergens`);
      return;
    }

    const updated = [...currentAllergens];
    if (editingIndex === null) {
      updated.push(value);
    } else {
      updated[editingIndex] = value;
    }

    await saveAllergens(updated);
  };

  const startEditing = (item: string, index: number) => {
    setAllergenInput(item);
    setEditingIndex(index);
  };

  const removeAllergen = (item: string, index: number) => {
    Alert.alert("Remove Allergen", `Remove ${item} from your allergens?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          const updated = user.allergens.filter(
            (_: string, itemIndex: number) => itemIndex !== index,
          );
          saveAllergens(updated);
        },
      },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user_id");
            navigation.replace(RootRoutes.AuthStack);
          },
        },
      ]
    );
  };

  if (!user) return null;

  return (
    <View className="flex-1 bg-[#f7f7f5]">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header Section */}
        <View className="bg-[#5f7f99] pt-16 pb-10 items-center rounded-b-3xl">

          {/* Profile Image */}
          <View className="relative">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              className="w-28 h-28 rounded-full border-4 border-white"
            />

            
          </View>

          <Text className="text-xl font-bold text-black mt-4">
            {user.username}
          </Text>

          <Text className="text-gray-700 mt-1">
            {user.email}
          </Text>
        </View>

        {/* Body Section */}
        <View className="px-5 mt-6">

          {/* About Card */}
          <View className="bg-white p-5 rounded-2xl shadow mb-5">
            <Text className="text-lg font-bold mb-3">
              Allergens
            </Text>

            <View className="flex-row items-center mb-4">
              <TextInput
                value={allergenInput}
                onChangeText={setAllergenInput}
                onSubmitEditing={handleSaveAllergen}
                editable={!saving}
                placeholder="Enter allergen"
                placeholderTextColor="#6b7280"
                autoCapitalize="words"
                returnKeyType="done"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-black"
              />

              {editingIndex !== null && (
                <TouchableOpacity
                  onPress={() => {
                    setAllergenInput("");
                    setEditingIndex(null);
                  }}
                  disabled={saving}
                  accessibilityLabel="Cancel editing"
                  className="w-10 h-10 ml-2 items-center justify-center"
                >
                  <Ionicons name="close" size={22} color="#4b5563" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleSaveAllergen}
                disabled={saving}
                accessibilityLabel={editingIndex === null ? "Add allergen" : "Save allergen"}
                className="w-11 h-11 ml-2 bg-black rounded-lg items-center justify-center"
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons
                    name={editingIndex === null ? "add" : "checkmark"}
                    size={24}
                    color="white"
                  />
                )}
              </TouchableOpacity>
            </View>

            {user.allergens?.length > 0 ? (
              <View className="flex-row flex-wrap">
                {user.allergens.map((item: string, index: number) => (
                  <View
                    key={index}
                    className="flex-row items-center bg-red-100 pl-3 pr-1 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-red-600 font-semibold">
                      {item}
                    </Text>
                    <TouchableOpacity
                      onPress={() => startEditing(item, index)}
                      disabled={saving}
                      accessibilityLabel={`Edit ${item}`}
                      className="w-8 h-8 items-center justify-center ml-1"
                    >
                      <Ionicons name="create-outline" size={16} color="#dc2626" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeAllergen(item, index)}
                      disabled={saving}
                      accessibilityLabel={`Remove ${item}`}
                      className="w-8 h-8 items-center justify-center"
                    >
                      <Ionicons name="close" size={18} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500">
                No allergens added
              </Text>
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-black py-4 rounded-2xl items-center mb-10"
          >
            <Text className="text-white font-bold text-lg">
              Logout
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
