import React from "react";
import { View, Text, Image } from "react-native";
interface ProductCardProps {
  product: any;
  labels?: {
    brand: string;
    weight: string;
    noName: string;
    notAvailable: string;
  };
}

const ProductCard = ({ product, labels }: ProductCardProps) => {
  const text = labels ?? {
    brand: "Brand",
    weight: "Weight",
    noName: "No name found",
    notAvailable: "N/A",
  };

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
            {product.product_name || text.noName}
          </Text>

          <Text className="text-gray-500">
            {text.brand}: {product.brand || product.brands || text.notAvailable}
          </Text>

          <Text className="text-gray-500">
            {text.weight}: {product.quantity || text.notAvailable}
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
