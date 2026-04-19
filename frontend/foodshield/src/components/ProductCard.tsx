import React from "react";
import { View, Text, Image } from "react-native";
import ScoreBadge from "./ScoreBadge";

const ProductCard = ({ product }: any) => {
  return (
    <View className="bg-[#f7f7f5] rounded-2xl p-4 shadow mb-4">
      <View className="flex-row">
        <Image
          source={{ uri: product.image }}
          className="w-28 h-24 rounded-xl"
          resizeMode="contain"
        />

        <View className="flex-1 ml-4 justify-between">
          <Text className="text-lg font-bold">
            {product.product_name || "No name found"}
          </Text>

          <Text className="text-gray-500">
            Brand: {product.brand || product.brands || "N/A"}
          </Text>

          <Text className="text-gray-500">
            Weight: {product.quantity || "N/A"}
          </Text>
          {/* <View className="flex flex-row justify-between ">
          <Text className="text-gray-600 ">
            Health Score: {(product.health_score)*10 || "N/A"}/100
          </Text>

          <ScoreBadge grade={product.grade} />
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
