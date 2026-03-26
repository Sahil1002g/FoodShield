import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../utils/api";
import ScoreBadge from "../components/ScoreBadge";

const statusColor = (grade: string) => {
  switch (grade?.toUpperCase()) {
    case "A":
    case "B":
      return "bg-green-100 text-green-700";
    case "C":
      return "bg-yellow-100 text-yellow-700";
    case "D":
    case "E":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusLabel = (grade: string) => {
  switch (grade?.toUpperCase()) {
    case "A":
    case "B":
      return "Safe";
    case "C":
      return "Caution";
    case "D":
    case "E":
      return "Unsafe";
    default:
      return "Unknown";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export default function HistoryScreen({ navigation }: any) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/history");
      setHistory(res.data);
    } catch (error) {
      console.log("History Error:", error);
    }
  };

  console.log("User History:", history);
  return (
    <SafeAreaView className="flex-1 bg-[#f7f7f5]">
      
      {/* Header */}
      <View className="bg-[#5f7f99] px-5 pt-14 pb-6 rounded-b-3xl">
        <Text className="text-[22px] font-bold text-black">
          Scan History
        </Text>
        <Text className="text-sm text-gray-700 mt-1">
          Products you checked recently
        </Text>
      </View>

      {/* History List */}
      <ScrollView
        className="px-5 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {history.map((item) => {
          const product = item.product;
          const grade = product?.nutri_score || product?.grade;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              className="flex-row bg-[#efe9e2] rounded-2xl p-3 mb-4 shadow"
              onPress={() =>
                navigation.navigate("ScanReport", {
                  barcode: product.barcode,
                })
              }
            >
              {/* Image */}
              <Image
                source={{ uri: product?.image }}
                className="w-[90px] h-[90px] rounded-xl"
                resizeMode="contain"
              />

              {/* Details */}
              <View className="ml-4 flex-1 justify-between">
                <View>
                  <Text className="text-base font-semibold text-black">
                    {product?.product_name}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {formatDate(item.created_at)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mt-2">
                 <View className="">
                  
                    <ScoreBadge grade={product.grade} />
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#999"
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
