import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import API from "../utils/api";

interface UserAllergensProps {
  productAllergens: string[];
}

export default function UserAllergens({ productAllergens }: UserAllergensProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.log("User fetch error:", error);
    }
  };

  const userAllergens: string[] = user?.allergens ?? [];

  const isUserAllergen = (item: string) =>
    userAllergens.some((ua) => ua.toLowerCase() === item.toLowerCase());

  const hasMatch = productAllergens?.some((item) => isUserAllergen(item));

  return (
    <View className="bg-[#efe9e2] p-4 rounded-xl mx-3 mt-4">
      <Text className="text-lg font-bold mb-3">Allergen</Text>

      {productAllergens && productAllergens.length > 0 ? (
        <>
          {/* Warning banner — only shown when user allergen matches */}
          {hasMatch && (
            <View className="flex-row items-center gap-2 bg-red-100 border border-red-300 rounded-xl px-3 py-2 mb-3">
              <Text className="text-red-600 text-base">⚠</Text>
              <Text className="text-red-700 text-xs font-semibold flex-1">
                Contains allergens matching your profile
              </Text>
            </View>
          )}

          <View className="flex-row flex-wrap gap-2">
            {productAllergens.map((item: string, index: number) => {
              const matched = isUserAllergen(item);
              const label = item.charAt(0).toUpperCase() + item.slice(1);

              return matched ? (
                // Highlighted chip — matches user's allergy
                <View
                  key={index}
                  className="flex-row items-center gap-1.5 bg-red-500 border border-red-600 rounded-full px-3 py-1.5"
                >
                  <Text className="text-white text-sm">⚠</Text>
                  <Text className="text-white text-sm font-bold">{label}</Text>
                </View>
              ) : (
                // Normal allergen chip
                <View
                  key={index}
                  className="flex-row items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1.5"
                >
                  <View className="w-2 h-2 rounded-full bg-red-700" />
                  <Text className="text-red-800 text-sm font-medium">{label}</Text>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <Text className="text-green-600 font-semibold">No Allergens Found</Text>
      )}
    </View>
  );
}