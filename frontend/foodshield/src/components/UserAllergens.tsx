import React from "react";
import { View, Text } from "react-native";

interface Props {
  productAllergens: string[];
  userAllergens: string[];
}

export default function UserAllergens({
  productAllergens = [],
  userAllergens = [],
}: Props) {

  const matchedAllergens = productAllergens.filter((item) =>
    userAllergens.includes(item)
  );

  if (matchedAllergens.length === 0) {
    return null; 
  }

  return (
    <View className="bg-red-100 p-4 rounded-xl mx-3 mt-4">
      <Text className="text-red-600 font-bold text-lg">
        ⚠ Contains Your Allergen
      </Text>

      {matchedAllergens.map((item, index) => (
        <Text
          key={index}
          className="text-red-600 font-semibold mt-1"
        >
          • {item}
        </Text>
      ))}
    </View>
  );
}