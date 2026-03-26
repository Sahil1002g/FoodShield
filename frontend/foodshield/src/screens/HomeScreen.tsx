import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import API from "../utils/api";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState("");
  const [recentHistory, setRecentHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchUser();
    fetchRecentHistory();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUsername(res.data.username);
    } catch (error) {
      console.log("User error:", error);
    }
  };

  const fetchRecentHistory = async () => {
    try {
      const res = await API.get("/history");

      
      const latestThree = res.data.slice(0, 3);
      setRecentHistory(latestThree);
    } catch (error) {
      console.log("Home history error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f7f7f5]">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="bg-[#5f7f99] px-5 pt-16 pb-6 rounded-b-3xl">
          <Text className="text-[22px] font-bold text-black">
            Hi {username || "User"},
          </Text>
          <Text className="text-sm text-gray-700 mt-1">
            Ready to make a smart choice?
          </Text>

          {/* Search box */}
          <View className="flex-row items-center bg-white rounded-full px-4 mt-4 h-12 shadow">
            <Ionicons name="search-outline" size={20} color="#777" />
            <TextInput
              placeholder="Search to find what fits you"
              placeholderTextColor="#999"
              className="flex-1 ml-2 text-black"
            />
          </View>
        </View>

        {/* Body */}
        <View className="px-5 pt-10">

          {/* Scan button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="h-[90px] flex-row items-center justify-center bg-[#b7d3e8] rounded-2xl shadow"
            onPress={() => navigation.navigate("Scan")}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={28}
              color="#000"
            />
            <Text className="ml-2 text-base font-semibold text-black">
              Scan Barcode
            </Text>
          </TouchableOpacity>

          {/* Recent Searches */}
          <View className="mt-7">
            <Text className="text-lg font-bold text-black mb-3">
              Recent Searches
            </Text>

            {recentHistory.length === 0 ? (
              <Text className="text-gray-500">No scans yet</Text>
            ) : (
              recentHistory.map((item) => {
                const product = item.product;

                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      navigation.navigate("ScanReport", {
                        barcode: product.barcode,
                      })
                    }
                  >
                    <View className="flex-row items-center bg-[#efe9e2] rounded-xl p-3 mb-3 shadow">

                      <Image
                        source={{ uri: product.image }}
                        className="w-[100px] h-[100px] rounded-lg"
                        resizeMode="contain"
                      />

                      <View className="ml-4 flex-1">
                        <Text className="text-base font-semibold text-black">
                          {product.product_name}
                        </Text>
                         <Text className="text-gray-500">
                                    Brand: {product.brand || "N/A"}
                                  </Text>
                        
                                  <Text className="text-gray-500">
                                    Weight: {product.quantity || "N/A"}
                                  </Text>

                        
                      </View>

                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
