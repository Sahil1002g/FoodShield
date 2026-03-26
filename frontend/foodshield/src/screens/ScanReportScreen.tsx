
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";

import { useRoute } from "@react-navigation/native";
import ProductCard from "../components/ProductCard";
import Recommendation from "../components/Recommendation";
import API from "../utils/api";
import UserAllergens from "../components/UserAllergens";

export default function ScanReportScreen() {
  const route = useRoute<any>();
  const { barcode } = route.params;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
  try {

    const response = await API.post("/scan", { barcode });

    console.log("FULL RESPONSE:", response.data);

    setProduct(response.data);

  } catch (error: any) {
    console.log("ERROR:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    
    <ScrollView className="flex-1 bg-white ">
      {/* Product Card */}
      <View className="bg-[#5f7f99] w-screen px-5 pt-6 pb-6 rounded-b-3xl">
      <ProductCard product={product}/>
      </View>
      
      {/* recommendation */}
      <Recommendation product={product}/>

      {/* user allergy */}
      <UserAllergens productAllergens={product.allergens} userAllergens={product.user_allergen_warning}/>


      {/* Positives */}
      <View className="bg-green-50 p-4 rounded-xl mt-4 mb-4 mx-3">
        <Text className="text-lg font-bold text-green-600 mb-2">
          ✅ Positives
        </Text>
        <Text>Protein: {product.protein} g</Text>
        <Text>Sodium: {product.sodium} mg</Text>
        <Text>Sugar: {product.sugar} g</Text>
      </View>

      {/* Negatives */}
      <View className="bg-red-50 p-4 rounded-xl mb-4 mx-3">
        <Text className="text-lg font-bold text-red-600 mb-2">
          ⚠ Negatives
        </Text>
        <Text>Processing Level: {product.nova_group}</Text>
        <Text>Saturated Fat: {product.saturated_fat} g</Text>
        <Text>Energy: {product.energy} kcal</Text>
      </View>

      {/* Ingredients */}
      <View className="bg-[#efe9e2] p-4 rounded-xl mx-3">
        <Text className="text-lg font-bold mb-2">Ingredients</Text>
        <Text>{product.ingredients}</Text>
      </View>

      {/* allergens */}
      <View className="bg-[#efe9e2] p-4 rounded-xl mx-3 mt-4 ">
        <Text className="text-lg font-bold mb-2">Allergen</Text>
        {product?.allergens && product.allergens.length > 0 ? (
    product.allergens.map((item: string, index: number) => {
      

      return (
        <View key={index} className="mb-2">
          <Text className="text-red-600 font-semibold">
             {index+1}. {item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
        </View>
      );
    })
  ) : (
    <Text className="text-green-600 font-semibold">
      No Allergens Found
    </Text>
  )}
      </View>

      {/* Additives */}

      <View className="bg-[#efe9e2] p-4 rounded-xl mt-4 px-4 mx-3">
        <Text className="text-lg font-bold mb-2">Additives</Text>
        {product.additives && product.additives.length > 0 ? (
  product.additives.map((item: any, index: number) => (
    <View key={index} style={{ marginBottom: 12 }}>
      
      <Text style={{ fontWeight: "bold" }}>
        {index+1}. {item.name} ({item.code?.toUpperCase()})
      </Text>

      <Text>Type: {item.e_type}</Text>

      <Text>{item.info}</Text>

    </View>
  ))
) : (
  <Text style={{  fontWeight: "bold" }}
  className="text-green-600">
    No Additives Found
  </Text>
)}

      </View>

      
    </ScrollView>
  );
}


