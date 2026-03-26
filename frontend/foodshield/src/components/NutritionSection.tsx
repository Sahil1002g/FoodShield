import React from "react";
import { View, Text } from "react-native";

const NutritionSection = ({
  title,
  color,
  items,
}: any) => {
  return (
    <View className="bg-white rounded-2xl p-4 shadow mb-4">
      <Text
        className="text-lg font-bold mb-3"
        style={{ color }}
      >
        {title}
      </Text>

      {items.map((item: any, index: number) => (
        <View
          key={index}
          className="flex-row justify-between mb-2"
        >
          <Text className="text-gray-600">
            {item.label}
          </Text>
          <Text className="font-semibold">
            {item.value || "N/A"}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default NutritionSection;
