import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/api";
import { RootRoutes } from "../navigation/Routes";
import Ionicons from "react-native-vector-icons/Ionicons";

const AccountScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
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

            {user.allergens?.length > 0 ? (
              <View className="flex-row flex-wrap">
                {user.allergens.map((item: string, index: number) => (
                  <View
                    key={index}
                    className="bg-red-100 px-4 py-2 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-red-600 font-semibold">
                      {item}
                    </Text>
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
