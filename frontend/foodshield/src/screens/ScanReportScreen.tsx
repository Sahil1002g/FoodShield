
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   ScrollView,
//   Image,
// } from "react-native";

// import { useRoute } from "@react-navigation/native";
// import ProductCard from "../components/ProductCard";
// import Recommendation from "../components/Recommendation";
// import API from "../utils/api";
// import UserAllergens from "../components/UserAllergens";

// export default function ScanReportScreen() {
//   const route = useRoute<any>();
//   const { barcode } = route.params;

//   const [product, setProduct] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProduct();
//   }, []);

//   const fetchProduct = async () => {
//   try {

//     const response = await API.post("/scan", { barcode });

//     console.log("FULL RESPONSE:", response.data);

//     setProduct(response.data);

//   } catch (error: any) {
//     console.log("ERROR:", error.response?.data || error.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <Text>Product not found</Text>
//       </View>
//     );
//   }

//   return (

//     <ScrollView className="flex-1 bg-white ">
//       {/* Product Card */}
//       <View className="bg-[#5f7f99] w-screen px-5 pt-6 pb-6 rounded-b-3xl">
//       <ProductCard product={product}/>
//       </View>

//       {/* recommendation */}
//       <Recommendation product={product}/>

//       {/* user allergy */}
//       <UserAllergens productAllergens={product.allergens} userAllergens={product.user_allergen_warning}/>


//       {/* Positives */}
//       <View className="bg-green-50 p-4 rounded-xl mt-4 mb-4 mx-3">
//         <Text className="text-lg font-bold text-green-600 mb-2">
//           ✅ Positives
//         </Text>
//         <Text>Protein: {product.protein} g</Text>
//         <Text>Sodium: {product.sodium} mg</Text>
//         <Text>Sugar: {product.sugar} g</Text>
//       </View>

//       {/* Negatives */}
//       <View className="bg-red-50 p-4 rounded-xl mb-4 mx-3">
//         <Text className="text-lg font-bold text-red-600 mb-2">
//           ⚠ Negatives
//         </Text>
//         <Text>Processing Level: {product.nova_group}</Text>
//         <Text>Saturated Fat: {product.saturated_fat} g</Text>
//         <Text>Energy: {product.energy} kcal</Text>
//       </View>

//       {/* Ingredients */}
//       <View className="bg-[#efe9e2] p-4 rounded-xl mx-3">
//         <Text className="text-lg font-bold mb-2">Ingredients</Text>
//         <Text>{product.ingredients}</Text>
//       </View>

//       {/* allergens */}
//       <View className="bg-[#efe9e2] p-4 rounded-xl mx-3 mt-4 ">
//         <Text className="text-lg font-bold mb-2">Allergen</Text>
//         {product?.allergens && product.allergens.length > 0 ? (
//     product.allergens.map((item: string, index: number) => {


//       return (
//         <View key={index} className="mb-2">
//           <Text className="text-red-600 font-semibold">
//              {index+1}. {item.charAt(0).toUpperCase() + item.slice(1)}
//           </Text>
//         </View>
//       );
//     })
//   ) : (
//     <Text className="text-green-600 font-semibold">
//       No Allergens Found
//     </Text>
//   )}
//       </View>

//       {/* Additives */}

//       <View className="bg-[#efe9e2] p-4 rounded-xl mt-4 px-4 mx-3">
//         <Text className="text-lg font-bold mb-2">Additives</Text>
//         {product.additives && product.additives.length > 0 ? (
//   product.additives.map((item: any, index: number) => (
//     <View key={index} style={{ marginBottom: 12 }}>

//       <Text style={{ fontWeight: "bold" }}>
//         {index+1}. {item.name} ({item.code?.toUpperCase()})
//       </Text>

//       <Text>Type: {item.e_type}</Text>

//       <Text>{item.info}</Text>

//     </View>
//   ))
// ) : (
//   <Text style={{  fontWeight: "bold" }}
//   className="text-green-600">
//     No Additives Found
//   </Text>
// )}

//       </View>


//     </ScrollView>
//   );
// }



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useRoute } from "@react-navigation/native";
import ProductCard from "../components/ProductCard";
import Recommendation from "../components/Recommendation";
import API from "../utils/api";
import UserAllergens from "../components/UserAllergens";
import ScoreBadge from "../components/ScoreBadge";
import AdditiveItem from "../components/AddativeItem";

// ── Circular Health Score Bar ──────────────────────────────────────────────────
function HealthScoreRing({ score, grade }: { score: number; grade: string }) {
  const R = 38;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const clampedScore = Math.min(Math.max(score, 0), 10);
  const filledLength = CIRCUMFERENCE * (clampedScore / 10);

  // Grade & arc color based on score
  const computedGrade =
    clampedScore >= 8 ? "A"
      : clampedScore >= 6.5 ? "B"
        : clampedScore >= 5 ? "C"
          : clampedScore >= 3.0 ? "D" : "E";

  const arcColor =
    clampedScore >= 8 ? "#16a34a"
      : clampedScore >= 6.5 ? "#65a30d"
        : clampedScore >= 5 ? "#d97706"
          : "#dc2626";

  if (grade.toLowerCase() === "unknown") {
    grade = "E"; // Treat unknown as E
  }
  else {
    grade = grade.toUpperCase();
  }

  return (
    <View className="flex-row items-center bg-white/30 rounded-2xl p-3 mt-4 gap-4">
      {/* Ring */}
      <View style={{ width: 96, height: 96 }}>
        <Svg width={96} height={96} viewBox="0 0 96 96">
          {/* Background track */}
          <Circle
            cx={48} cy={48} r={R}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={8}
          />
          {/* Filled arc */}
          <Circle
            cx={48} cy={48} r={R}
            fill="none"
            stroke={arcColor}
            strokeWidth={8}
            strokeDasharray={`${filledLength} ${CIRCUMFERENCE - filledLength}`}
            strokeLinecap="round"
            rotation={-90}
            origin="48, 48"
          />
        </Svg>
        {/* Score number centred on the ring */}
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
            {clampedScore}
          </Text>
        </View>
      </View>

      {/* Right-side meta */}
      <View className="flex-1">
        <Text className="text-white/60 text-xs uppercase tracking-widest mb-1">
          Health Score
        </Text>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-white text-3xl font-bold">{clampedScore}</Text>
          <Text className="text-white/50 text-base">/10</Text>
          <View
            style={{ backgroundColor: arcColor }}
            className="w-7 h-7 rounded-full justify-center items-center ml-1"
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
              {grade || computedGrade}
            </Text>
          </View>
        </View>
        <View className="bg-white/10 rounded-lg px-2.5 py-1 self-start mt-2">
          <Text className="text-white/60 text-xs">per 100g serving</Text>
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
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
    <ScrollView className="flex-1 bg-white">

      {/* Product Card + Health Score Ring — only the ring is new */}
      <View className="bg-[#5f7f99] w-screen px-5 pt-6 pb-6 rounded-b-3xl">
        <ProductCard product={product} />
        <HealthScoreRing score={product.health_score ?? product.score ?? 0} grade={product.grade} />
      </View>

      {/* recommendation */}
      <Recommendation product={product} />

      {/* user allergy
      <UserAllergens
        productAllergens={product.allergens}
        userAllergens={product.user_allergen_warning}
      /> */}
      {/* <UserAllergens productAllergens={product.allergens} /> */}

      {/* Positives */}
      <View className="bg-green-100 p-4 rounded-2xl mt-4 mb-3 mx-3">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="bg-green-100 w-7 h-7 rounded-lg items-center justify-center">
            <Text className="text-green-600 text-sm font-bold">✓</Text>
          </View>
          <Text className="text-green-600 text-base font-semibold">Positives</Text>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-green-700 text-base font-bold">{product.protein}g</Text>
            <Text className="text-gray-400 text-xs mt-1">Protein</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-green-700 text-base font-bold">{product.sodium}mg</Text>
            <Text className="text-gray-400 text-xs mt-1">Sodium</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-green-700 text-base font-bold">{product.sugar}g</Text>
            <Text className="text-gray-400 text-xs mt-1">Sugar</Text>
          </View>
        </View>
      </View>

      {/* Negatives */}
      <View className="bg-red-100 p-4 rounded-2xl mb-4 mx-3">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="bg-red-100 w-7 h-7 rounded-lg items-center justify-center">
            <Text className="text-red-500 text-sm font-bold">⚠</Text>
          </View>
          <Text className="text-red-500 text-base font-semibold">Negatives</Text>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-red-500 text-base font-bold">Level {product.nova_group}</Text>
            <Text className="text-gray-400 text-xs mt-1">Processing</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-red-500 text-base font-bold">{product.saturated_fat}g</Text>
            <Text className="text-gray-400 text-xs mt-1">Sat. Fat</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-red-500 text-base font-bold">{product.energy}</Text>
            <Text className="text-gray-400 text-xs mt-1">kcal</Text>
          </View>
        </View>
      </View>

      {/* Ingredients */}
      <View className="bg-[#efe9e2] p-4 rounded-xl mx-3">
        <Text className="text-lg font-bold mb-2">Ingredients</Text>
        <Text>{product.ingredients}</Text>
      </View>

      {/* Allergens */}
      {/* <View className="bg-[#efe9e2] p-4 rounded-xl mx-3 mt-4">
        <Text className="text-lg font-bold mb-3">Allergen</Text>
        {product?.allergens && product.allergens.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {product.allergens.map((item: string, index: number) => (
              <View
                key={index}
                className="flex-row items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1.5"
              >
                <View className="w-2 h-2 rounded-full bg-red-700" />
                <Text className="text-red-800 text-sm font-medium">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-green-600 font-semibold">No Allergens Found</Text>
        )}
      </View> */}
      <UserAllergens productAllergens={product.allergens} />

      {/* Additives */}
      <View className="bg-[#efe9e2] p-4 rounded-xl mt-4 px-4 mx-3">
        <Text className="text-lg font-bold mb-2">Additives</Text>
        {product.additives && product.additives.length > 0 ? (
          product.additives.map((item: any, index: number) => (
            <AdditiveItem key={index} item={item} index={index} />
          ))
        ) : (
          <Text style={{ fontWeight: "bold" }} className="text-green-600">
            No Additives Found
          </Text>
        )}
      </View>

    </ScrollView>
  );
}