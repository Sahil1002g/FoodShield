import React, { useCallback, useState } from "react";
import { View, Text } from "react-native";
import API from "../utils/api";
import { useFocusEffect } from "@react-navigation/native";

const ALLERGEN_ALIASES: Record<string, string> = {
  groundnut: "peanut",
  groundnuts: "peanut",
};

const normalizeAllergen = (value: string) => {
  const words = value
    .toLowerCase()
    .replace(/^[a-z]{2}:/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const alias = ALLERGEN_ALIASES[word];
      if (alias) return alias;
      return word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word;
    });

  return words.join(" ");
};

interface UserAllergensProps {
  productAllergens: string[];
  matchingAllergens?: string[];
  labels?: {
    title: string;
    warning: string;
    noneFound: string;
  };
}

export default function UserAllergens({
  productAllergens,
  matchingAllergens,
  labels,
}: UserAllergensProps) {
  const [user, setUser] = useState<any>(null);
  const text = labels ?? {
    title: "Allergen",
    warning: "Contains allergens matching your profile",
    noneFound: "No Allergens Found",
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.log("User fetch error:", error);
    }
  };

  const userAllergens: string[] = user?.allergens ?? [];

  const isUserAllergen = (item: string) => {
    const normalizedItem = normalizeAllergen(item);
    return userAllergens.some(
      (allergen) => normalizeAllergen(allergen) === normalizedItem,
    );
  };

  const sourceAllergens = matchingAllergens ?? productAllergens;
  const hasMatch = sourceAllergens?.some((item) => isUserAllergen(item));

  return (
    <View className="bg-[#efe9e2] p-4 rounded-xl mx-3 mt-4">
      <Text className="text-lg font-bold mb-3">{text.title}</Text>

      {productAllergens && productAllergens.length > 0 ? (
        <>
          {/* Warning banner — only shown when user allergen matches */}
          {hasMatch && (
            <View className="flex-row items-center gap-2 bg-red-100 border border-red-300 rounded-xl px-3 py-2 mb-3">
              <Text className="text-red-600 text-base">⚠</Text>
              <Text className="text-red-700 text-xs font-semibold flex-1">
                {text.warning}
              </Text>
            </View>
          )}

          <View className="flex-row flex-wrap gap-2">
            {productAllergens.map((item: string, index: number) => {
              const matched = isUserAllergen(sourceAllergens[index] ?? item);
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
        <Text className="text-green-600 font-semibold">{text.noneFound}</Text>
      )}
    </View>
  );
}
