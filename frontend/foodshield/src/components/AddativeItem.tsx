import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface AdditiveItemProps {
  item: {
    name: string;
    code?: string;
    e_type?: string;
    info?: string;
  };
  index: number;
}

export default function AdditiveItem({ item, index }: AdditiveItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mb-2 bg-white rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <TouchableOpacity
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.7}
        className="flex-row items-center justify-between px-3 py-3"
      >
        <View className="flex-1 pr-2">
          <Text className="font-semibold text-sm text-black">
            {index + 1}. {item.name}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {item.code?.toUpperCase()}
          </Text>
        </View>
        <Text className="text-gray-400 text-base">
          {expanded ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {/* Expanded details */}
      {expanded && (
        <View className="px-3 pb-3 border-t border-gray-100">
          <Text className="text-xs text-gray-500 mt-2">
            <Text className="font-semibold text-gray-700">Type: </Text>
            {item.e_type}
          </Text>
          <Text className="text-xs text-gray-500 mt-1 leading-4">
            {item.info}
          </Text>
        </View>
      )}
    </View>
  );
}