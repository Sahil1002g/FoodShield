
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   ScrollView,
//   Image,
// } from "react-native";
// import Svg, { Circle } from "react-native-svg";

// import { useRoute } from "@react-navigation/native";
// import ProductCard from "../components/ProductCard";
// import Recommendation from "../components/Recommendation";
// import API from "../utils/api";
// import UserAllergens from "../components/UserAllergens";
// import ScoreBadge from "../components/ScoreBadge";
// import AdditiveItem from "../components/AddativeItem";

// // ── Circular Health Score Bar ──────────────────────────────────────────────────
// function HealthScoreRing({ score, grade }: { score: number; grade: string }) {
//   const R = 38;
//   const CIRCUMFERENCE = 2 * Math.PI * R;
//   const clampedScore = Math.min(Math.max(score, 0), 10);
//   const filledLength = CIRCUMFERENCE * (clampedScore / 10);

//   // Grade & arc color based on score
//   const computedGrade =
//     clampedScore >= 8 ? "A"
//       : clampedScore >= 6.5 ? "B"
//         : clampedScore >= 5 ? "C"
//           : clampedScore >= 3.0 ? "D" : "E";

//   const arcColor =
//     clampedScore >= 8 ? "#16a34a"
//       : clampedScore >= 6.5 ? "#65a30d"
//         : clampedScore >= 5 ? "#d97706"
//           : "#dc2626";

//   if (grade.toLowerCase() === "unknown") {
//     grade = "E"; // Treat unknown as E
//   }
//   else {
//     grade = grade.toUpperCase();
//   }

//   return (
//     <View className="flex-row items-center bg-white/30 rounded-2xl p-3 mt-4 gap-4">
//       {/* Ring */}
//       <View style={{ width: 96, height: 96 }}>
//         <Svg width={96} height={96} viewBox="0 0 96 96">
//           {/* Background track */}
//           <Circle
//             cx={48} cy={48} r={R}
//             fill="none"
//             stroke="rgba(255,255,255,0.25)"
//             strokeWidth={8}
//           />
//           {/* Filled arc */}
//           <Circle
//             cx={48} cy={48} r={R}
//             fill="none"
//             stroke={arcColor}
//             strokeWidth={8}
//             strokeDasharray={`${filledLength} ${CIRCUMFERENCE - filledLength}`}
//             strokeLinecap="round"
//             rotation={-90}
//             origin="48, 48"
//           />
//         </Svg>
//         {/* Score number centred on the ring */}
//         <View
//           style={{
//             position: "absolute",
//             top: 0, left: 0, right: 0, bottom: 0,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
//             {clampedScore}
//           </Text>
//         </View>
//       </View>

//       {/* Right-side meta */}
//       <View className="flex-1">
//         <Text className="text-white/60 text-xs uppercase tracking-widest mb-1">
//           Health Score
//         </Text>
//         <View className="flex-row items-baseline gap-1">
//           <Text className="text-white text-3xl font-bold">{clampedScore}</Text>
//           <Text className="text-white/50 text-base">/10</Text>
//           <View
//             style={{ backgroundColor: arcColor }}
//             className="w-7 h-7 rounded-full justify-center items-center ml-1"
//           >
//             <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
//               {grade || computedGrade}
//             </Text>
//           </View>
//         </View>
//         <View className="bg-white/10 rounded-lg px-2.5 py-1 self-start mt-2">
//           <Text className="text-white/60 text-xs">per 100g serving</Text>
//         </View>
//       </View>
//     </View>
//   );
// }

// // ── Main Screen ────────────────────────────────────────────────────────────────
// export default function ScanReportScreen() {
//   const route = useRoute<any>();
//   const { barcode } = route.params;

//   const [product, setProduct] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchProduct();
//   }, []);

//   const fetchProduct = async () => {
//     try {
//       const response = await API.post("/scan", { barcode });
//       console.log("FULL RESPONSE:", response.data);
//       setProduct(response.data);
//     } catch (error: any) {
//       console.log("ERROR:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

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
//     <ScrollView className="flex-1 bg-white">

//       {/* Product Card + Health Score Ring — only the ring is new */}
//       <View className="bg-[#5f7f99] w-screen px-5 pt-6 pb-6 rounded-b-3xl">
//         <ProductCard product={product} />
//         <HealthScoreRing score={product.health_score ?? product.score ?? 0} grade={product.grade} />
//       </View>

//       {/* recommendation */}
//       <Recommendation product={product} />

//       {/* user allergy
//       <UserAllergens
//         productAllergens={product.allergens}
//         userAllergens={product.user_allergen_warning}
//       /> */}
//       {/* <UserAllergens productAllergens={product.allergens} /> */}

//       {/* Positives */}
//       <View className="bg-green-100 p-4 rounded-2xl mt-4 mb-3 mx-3">
//         <View className="flex-row items-center gap-2 mb-3">
//           <View className="bg-green-100 w-7 h-7 rounded-lg items-center justify-center">
//             <Text className="text-green-600 text-sm font-bold">✓</Text>
//           </View>
//           <Text className="text-green-600 text-base font-semibold">Positives</Text>
//         </View>
//         <View className="flex-row gap-2">
//           <View className="flex-1 bg-white rounded-xl py-3 items-center">
//             <Text className="text-green-700 text-base font-bold">{product.protein}g</Text>
//             <Text className="text-gray-400 text-xs mt-1">Protein</Text>
//           </View>
//           <View className="flex-1 bg-white rounded-xl py-3 items-center">
//             <Text className="text-green-700 text-base font-bold">{product.sodium}mg</Text>
//             <Text className="text-gray-400 text-xs mt-1">Sodium</Text>
//           </View>
//           <View className="flex-1 bg-white rounded-xl py-3 items-center">
//             <Text className="text-green-700 text-base font-bold">{product.sugar}g</Text>
//             <Text className="text-gray-400 text-xs mt-1">Sugar</Text>
//           </View>
//         </View>
//       </View>

//       {/* Negatives */}
//       <View className="bg-red-100 p-4 rounded-2xl mb-4 mx-3">
//         <View className="flex-row items-center gap-2 mb-3">
//           <View className="bg-red-100 w-7 h-7 rounded-lg items-center justify-center">
//             <Text className="text-red-500 text-sm font-bold">⚠</Text>
//           </View>
//           <Text className="text-red-500 text-base font-semibold">Negatives</Text>
//         </View>
//         <View className="flex-row gap-2">
//           <View className="flex-1 bg-white rounded-xl py-3 items-center">
//             <Text className="text-red-500 text-base font-bold">Level {product.nova_group}</Text>
//             <Text className="text-gray-400 text-xs mt-1">Processing</Text>
//           </View>
//           <View className="flex-1 bg-white rounded-xl py-3 items-center">
//             <Text className="text-red-500 text-base font-bold">{product.saturated_fat}g</Text>
//             <Text className="text-gray-400 text-xs mt-1">Sat. Fat</Text>
//           </View>
//           <View className="flex-1 bg-white rounded-xl py-3 items-center">
//             <Text className="text-red-500 text-base font-bold">{product.energy}</Text>
//             <Text className="text-gray-400 text-xs mt-1">kcal</Text>
//           </View>
//         </View>
//       </View>

//       {/* Ingredients */}
//       <View className="bg-[#efe9e2] p-4 rounded-xl mx-3">
//         <Text className="text-lg font-bold mb-2">Ingredients</Text>
//         <Text>{product.ingredients}</Text>
//       </View>

//       {/* Allergens */}
//       {/* <View className="bg-[#efe9e2] p-4 rounded-xl mx-3 mt-4">
//         <Text className="text-lg font-bold mb-3">Allergen</Text>
//         {product?.allergens && product.allergens.length > 0 ? (
//           <View className="flex-row flex-wrap gap-2">
//             {product.allergens.map((item: string, index: number) => (
//               <View
//                 key={index}
//                 className="flex-row items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1.5"
//               >
//                 <View className="w-2 h-2 rounded-full bg-red-700" />
//                 <Text className="text-red-800 text-sm font-medium">
//                   {item.charAt(0).toUpperCase() + item.slice(1)}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         ) : (
//           <Text className="text-green-600 font-semibold">No Allergens Found</Text>
//         )}
//       </View> */}
//       <UserAllergens productAllergens={product.allergens} />

//       {/* Additives */}
//       <View className="bg-[#efe9e2] p-4 rounded-xl mt-4 px-4 mx-3">
//         <Text className="text-lg font-bold mb-2">Additives</Text>
//         {product.additives && product.additives.length > 0 ? (
//           product.additives.map((item: any, index: number) => (
//             <AdditiveItem key={index} item={item} index={index} />
//           ))
//         ) : (
//           <Text style={{ fontWeight: "bold" }} className="text-green-600">
//             No Additives Found
//           </Text>
//         )}
//       </View>

//     </ScrollView>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useRoute } from "@react-navigation/native";
import ProductCard from "../components/ProductCard";
import Recommendation from "../components/Recommendation";
import API from "../utils/api";
import UserAllergens from "../components/UserAllergens";
import AdditiveItem from "../components/AddativeItem";

// ── Language config ────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "HI" },
  { code: "mr", label: "MR" },
];

// Static UI labels — no API needed for these
const UI_LABELS: Record<string, Record<string, string>> = {
  en: {
    positives:   "Positives",
    negatives:   "Negatives",
    processing:  "Processing",
    sat_fat:     "Sat. Fat",
    protein:     "Protein",
    sodium:      "Sodium",
    sugar:       "Sugar",
    ingredients: "Ingredients",
    additives:   "Additives",
    no_additives:"No Additives Found",
    health_score:"Health Score",
    per_100g:    "per 100g serving",
    translating: "Translating…",
    level:        "Level",
    energy:       "kcal",
    brand:        "Brand",
    weight:       "Weight",
    no_name:      "No name found",
    not_available:"N/A",
    allergen:     "Allergens",
    allergen_warning: "Contains allergens matching your profile",
    no_allergens: "No Allergens Found",
    type:         "Type",
    product_not_found: "Product not found",
    translation_failed: "Translation failed. Please try again.",
  },
  hi: {
    positives:   "सकारात्मक",
    negatives:   "नकारात्मक",
    processing:  "प्रसंस्करण",
    sat_fat:     "संतृप्त वसा",
    protein:     "प्रोटीन",
    sodium:      "सोडियम",
    sugar:       "चीनी",
    ingredients: "सामग्री",
    additives:   "योजक",
    no_additives:"कोई योजक नहीं मिला",
    health_score:"स्वास्थ्य स्कोर",
    per_100g:    "प्रति 100 ग्राम",
    translating: "अनुवाद हो रहा है…",
    level:        "स्तर",
    energy:       "किलो कैलोरी",
    brand:        "ब्रांड",
    weight:       "वजन",
    no_name:      "नाम उपलब्ध नहीं है",
    not_available:"उपलब्ध नहीं",
    allergen:     "एलर्जी कारक",
    allergen_warning: "इसमें आपकी प्रोफ़ाइल से मेल खाने वाले एलर्जी कारक हैं",
    no_allergens: "कोई एलर्जी कारक नहीं मिला",
    type:         "प्रकार",
    product_not_found: "उत्पाद नहीं मिला",
    translation_failed: "अनुवाद नहीं हो सका। कृपया पुनः प्रयास करें।",
  },
  mr: {
    positives:   "सकारात्मक",
    negatives:   "नकारात्मक",
    processing:  "प्रक्रिया",
    sat_fat:     "संतृप्त चरबी",
    protein:     "प्रथिने",
    sodium:      "सोडियम",
    sugar:       "साखर",
    ingredients: "साहित्य",
    additives:   "मिश्रके",
    no_additives:"कोणतेही मिश्रके आढळले नाहीत",
    health_score:"आरोग्य गुण",
    per_100g:    "प्रति 100 ग्रॅम",
    translating: "भाषांतर होत आहे…",
    level:        "पातळी",
    energy:       "किलो कॅलरी",
    brand:        "ब्रँड",
    weight:       "वजन",
    no_name:      "नाव उपलब्ध नाही",
    not_available:"उपलब्ध नाही",
    allergen:     "अॅलर्जन्स",
    allergen_warning: "यामध्ये तुमच्या प्रोफाइलशी जुळणारे अॅलर्जन्स आहेत",
    no_allergens: "कोणतेही अॅलर्जन्स आढळले नाहीत",
    type:         "प्रकार",
    product_not_found: "उत्पादन सापडले नाही",
    translation_failed: "भाषांतर करता आले नाही. कृपया पुन्हा प्रयत्न करा.",
  },
};

// ── Language Toggle ────────────────────────────────────────────────────────────
function LanguageToggle({
  current,
  onChange,
  disabled,
}: {
  current: string;
  onChange: (lang: string) => void;
  disabled: boolean;
}) {
  return (
    <View className="flex-row bg-white/20 rounded-xl p-1 self-end mt-3 gap-1">
      {LANGUAGES.map((lang) => {
        const active = current === lang.code;
        return (
          <TouchableOpacity
            key={lang.code}
            onPress={() => onChange(lang.code)}
            disabled={disabled || active}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 10,
              backgroundColor: active ? "#ffffff" : "transparent",
              opacity: disabled && !active ? 0.5 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: active ? "#5f7f99" : "rgba(255,255,255,0.75)",
              }}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Health Score Ring ──────────────────────────────────────────────────────────
function HealthScoreRing({
  score,
  grade,
  labels,
}: {
  score: number;
  grade: string;
  labels: Record<string, string>;
}) {
  const R = 38;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const clamped = Math.min(Math.max(score, 0), 10);
  const filled = CIRCUMFERENCE * (clamped / 10);

  const arcColor =
    clamped >= 8 ? "#16a34a"
      : clamped >= 6.5 ? "#65a30d"
        : clamped >= 5 ? "#d97706"
          : "#dc2626";

  const computedGrade =
    clamped >= 8 ? "A" : clamped >= 6.5 ? "B" : clamped >= 5 ? "C" : clamped >= 3 ? "D" : "E";

  const displayGrade =
    grade?.toLowerCase() === "unknown" ? "E" : (grade?.toUpperCase() || computedGrade);

  return (
    <View className="flex-row items-center bg-white/30 rounded-2xl p-3 mt-4 gap-4">
      <View style={{ width: 96, height: 96 }}>
        <Svg width={96} height={96} viewBox="0 0 96 96">
          <Circle
            cx={48} cy={48} r={R}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={8}
          />
          <Circle
            cx={48} cy={48} r={R}
            fill="none"
            stroke={arcColor}
            strokeWidth={8}
            strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`}
            strokeLinecap="round"
            rotation={-90}
            origin="48, 48"
          />
        </Svg>
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>{clamped}</Text>
        </View>
      </View>

      <View className="flex-1">
        <Text className="text-white/60 text-xs uppercase tracking-widest mb-1">
          {labels.health_score}
        </Text>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-white text-3xl font-bold">{clamped}</Text>
          <Text className="text-white/50 text-base">/10</Text>
          <View
            style={{ backgroundColor: arcColor }}
            className="w-7 h-7 rounded-full justify-center items-center ml-1"
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>{displayGrade}</Text>
          </View>
        </View>
        <View className="bg-white/10 rounded-lg px-2.5 py-1 self-start mt-2">
          <Text className="text-white/60 text-xs">{labels.per_100g}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Translation helper ─────────────────────────────────────────────────────────
async function translateProductContent(
  product: any,
  targetLang: string
): Promise<any> {
  const response = await API.post("/scan/translate", {
    target_language: targetLang,
    product,
  });
  return response.data;
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function ScanReportScreen() {
  const route = useRoute<any>();
  const { barcode } = route.params;

  const [product, setProduct]     = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [language, setLanguage]   = useState("en");
  const [translating, setTranslating] = useState(false);

  // Cache: { hi: { ingredients, additives }, mr: { ... } }
  const cache = useRef<Record<string, any>>({});

  useEffect(() => { fetchProduct(); }, []);

  const fetchProduct = async () => {
    try {
      const response = await API.post("/scan", { barcode });
      setProduct(response.data);
    } catch (error: any) {
      console.log("ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    if (lang === language) return;

    // English = original data, nothing to fetch
    if (lang === "en") {
      setLanguage(lang);
      return;
    }

    // Already cached — instant switch
    if (cache.current[lang]) {
      setLanguage(lang);
      return;
    }

    setTranslating(true);
    try {
      cache.current[lang] = await translateProductContent(product, lang);
      setLanguage(lang);
    } catch (e) {
      console.log("Translation error:", e);
      Alert.alert(
        UI_LABELS[lang].translation_failed,
        UI_LABELS.en.translation_failed,
      );
    } finally {
      setTranslating(false);
    }
  };

  // ── Derived display data ───────────────────────────────────────────────────
  const labels      = UI_LABELS[language] ?? UI_LABELS.en;
  const displayProduct = language === "en"
    ? product
    : (cache.current[language] ?? product);

  // ── Loading / error states ─────────────────────────────────────────────────
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
        <Text>{labels.product_not_found}</Text>
      </View>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <ScrollView className="flex-1 bg-white">

      {/* ── Header card ── */}
      <View className="bg-[#5f7f99] w-screen px-5 pt-6 pb-6 rounded-b-3xl">
        <ProductCard
          product={displayProduct}
          labels={{
            brand: labels.brand,
            weight: labels.weight,
            noName: labels.no_name,
            notAvailable: labels.not_available,
          }}
        />

        {/* Language Toggle — top-right inside header */}
        <LanguageToggle
          current={language}
          onChange={handleLanguageChange}
          disabled={translating}
        />

        <HealthScoreRing
          score={product.health_score ?? product.score ?? 0}
          grade={product.grade}
          labels={labels}
        />
      </View>

      {/* Translating indicator */}
      {translating && (
        <View className="flex-row items-center justify-center py-2 gap-2 bg-blue-50 mx-3 mt-3 rounded-xl">
          <ActivityIndicator size="small" color="#5f7f99" />
          <Text className="text-[#5f7f99] text-sm font-medium">{labels.translating}</Text>
        </View>
      )}

      {/* ── Recommendation ── */}
      <Recommendation
        product={displayProduct}
        originalRecommendation={product.recommendation}
      />

      {/* ── Positives ── */}
      <View className="bg-green-100 p-4 rounded-2xl mt-4 mb-3 mx-3">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="bg-green-100 w-7 h-7 rounded-lg items-center justify-center">
            <Text className="text-green-600 text-sm font-bold">✓</Text>
          </View>
          <Text className="text-green-600 text-base font-semibold">{labels.positives}</Text>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-green-700 text-base font-bold">{product.protein}g</Text>
            <Text className="text-gray-400 text-xs mt-1">{labels.protein}</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-green-700 text-base font-bold">{product.sodium}mg</Text>
            <Text className="text-gray-400 text-xs mt-1">{labels.sodium}</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-green-700 text-base font-bold">{product.sugar}g</Text>
            <Text className="text-gray-400 text-xs mt-1">{labels.sugar}</Text>
          </View>
        </View>
      </View>

      {/* ── Negatives ── */}
      <View className="bg-red-100 p-4 rounded-2xl mb-4 mx-3">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="bg-red-100 w-7 h-7 rounded-lg items-center justify-center">
            <Text className="text-red-500 text-sm font-bold">⚠</Text>
          </View>
          <Text className="text-red-500 text-base font-semibold">{labels.negatives}</Text>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-red-500 text-base font-bold">{labels.level} {product.nova_group}</Text>
            <Text className="text-gray-400 text-xs mt-1">{labels.processing}</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-red-500 text-base font-bold">{product.saturated_fat}g</Text>
            <Text className="text-gray-400 text-xs mt-1">{labels.sat_fat}</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl py-3 items-center">
            <Text className="text-red-500 text-base font-bold">{product.energy}</Text>
            <Text className="text-gray-400 text-xs mt-1">{labels.energy}</Text>
          </View>
        </View>
      </View>

      {/* ── Ingredients ── */}
      <View className="bg-[#efe9e2] p-4 rounded-xl mx-3">
        <Text className="text-lg font-bold mb-2">{labels.ingredients}</Text>
        <Text>{displayProduct.ingredients}</Text>
      </View>

      {/* ── Allergens ── */}
      <UserAllergens
        productAllergens={displayProduct.allergens}
        matchingAllergens={product.allergens}
        labels={{
          title: labels.allergen,
          warning: labels.allergen_warning,
          noneFound: labels.no_allergens,
        }}
      />

      {/* ── Additives ── */}
      <View className="bg-[#efe9e2] p-4 rounded-xl mt-4 px-4 mx-3 mb-6">
        <Text className="text-lg font-bold mb-2">{labels.additives}</Text>
        {displayProduct.additives?.length > 0 ? (
          displayProduct.additives.map((item: any, index: number) => (
            <AdditiveItem
              key={index}
              item={item}
              index={index}
              typeLabel={labels.type}
            />
          ))
        ) : (
          <Text style={{ fontWeight: "bold" }} className="text-green-600">
            {labels.no_additives}
          </Text>
        )}
      </View>

    </ScrollView>
  );
}
