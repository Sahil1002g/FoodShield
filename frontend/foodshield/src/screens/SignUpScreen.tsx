// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert
// } from "react-native";
// import API from "../utils/api";

// const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// const getErrorMessage = (error: any, fallback: string) => {
//   const detail = error.response?.data?.detail;

//   if (typeof detail === "string") {
//     return detail;
//   }

//   if (Array.isArray(detail) && detail.length > 0) {
//     return detail
//       .map((item) => item?.msg)
//       .filter(Boolean)
//       .join("\n");
//   }

//   return fallback;
// };

// const SignupScreen = ({ navigation }: any) => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [allergenInput, setAllergenInput] = useState("");
//   const [allergens, setAllergens] = useState<string[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const addAllergen = () => {
//     if (allergenInput.trim() === "") return;
//     setAllergens([...allergens, allergenInput.trim()]);
//     setAllergenInput("");
//   };

//   const signup = async () => {
//   const trimmedUsername = username.trim();
//   const trimmedEmail = email.trim().toLowerCase();
//   const trimmedPassword = password.trim();
//   let updatedAllergens = [...allergens];

//   if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
//     Alert.alert("Signup Failed", "Please enter username, email and password");
//     return;
//   }

//   if (trimmedUsername.length < 3) {
//     Alert.alert("Signup Failed", "Username must be at least 3 characters");
//     return;
//   }

//   if (!emailPattern.test(trimmedEmail)) {
//     Alert.alert("Signup Failed", "Please enter a valid email address");
//     return;
//   }

//   if (trimmedPassword.length < 6) {
//     Alert.alert("Signup Failed", "Password must be at least 6 characters");
//     return;
//   }

//   // Add last typed allergen if not added
//   if (allergenInput.trim() !== "") {
//     updatedAllergens.push(allergenInput.trim());
//   }

//   updatedAllergens = Array.from(new Set(updatedAllergens.map((item) => item.trim()).filter(Boolean)));

//   try {
//     setIsSubmitting(true);
//     await API.post("/auth/signup", {
//       username: trimmedUsername,
//       email: trimmedEmail,
//       password: trimmedPassword,
//       allergens: updatedAllergens
//     });

//     Alert.alert("Success", "Account created successfully");
//     navigation.navigate("Login");

//   } catch (error: any) {
//     Alert.alert("Signup Failed", getErrorMessage(error, "Signup failed"));
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   return (
//     <ScrollView className="flex-1 bg-white p-6">

//       <Text className="text-3xl font-bold mb-6 text-center">
//         Create Account
//       </Text>

//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         placeholderTextColor="gray"
//         autoCapitalize="none"
//         className="border p-3 rounded-xl mb-4 text-black"
//       />

//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         placeholderTextColor="gray"
//         className="border p-3 rounded-xl mb-4 text-black"
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         placeholderTextColor="gray"
//         className="border p-3 rounded-xl mb-4 text-black"
//       />

//       {/* Allergens */}
//       <Text className="font-bold mb-2">Add Allergens</Text>

//       <View className="flex-row mb-4">
//         <TextInput
//           placeholder="Enter allergen"
//           value={allergenInput}
//           onChangeText={setAllergenInput}
//           placeholderTextColor="gray"
//           className="flex-1 border p-3 rounded-xl mr-2 text-black"
//         />

//         <TouchableOpacity
//           onPress={addAllergen}
//           className="bg-orange-500 px-4 justify-center rounded-xl"
//         >
//           <Text className="text-white font-bold">Add</Text>
//         </TouchableOpacity>
//       </View>

//       <View className="flex-row flex-wrap mb-6">
//         {allergens.map((item, index) => (
//           <View
//             key={index}
//             className="bg-red-100 px-3 py-1 rounded-full mr-2 mb-2"
//           >
//             <Text className="text-red-600 font-semibold">
//               {item}
//             </Text>
//           </View>
//         ))}
//       </View>

//       <TouchableOpacity
//         onPress={signup}
//         disabled={isSubmitting}
//         className="bg-black py-4 rounded-xl items-center"
//       >
//         <Text className="text-white font-bold text-lg">
//           {isSubmitting ? "SIGNING UP..." : "SIGN UP"}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => navigation.navigate("Login")}
//         className="mt-4 items-center"
//       >
//         <Text className="text-blue-500">
//           Already have an account? Login
//         </Text>
//       </TouchableOpacity>

//     </ScrollView>
//   );
// };

// export default SignupScreen;


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import API from "../utils/api";
import Svg, { Path, Circle, Rect } from "react-native-svg";

const { width } = Dimensions.get("window");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getErrorMessage = (error: any, fallback: string) => {
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0)
    return detail.map((item) => item?.msg).filter(Boolean).join("\n");
  return fallback;
};

/* ── SVG Icons ── */
const FoodIcons = () => (
  <Svg width={width} height={110} style={{ position: "absolute", top: 0, left: 0 }}>
   
    {/* Carrot */}
    <Path d="M370 138 Q380 153 375 180 Q370 193 365 188 Q360 183 365 163 Q362 150 370 138Z M370 138 Q365 128 368 123 M370 138 Q375 128 377 123 M370 138 Q370 126 372 121" stroke="rgba(255,255,255,0.32)" strokeWidth="2" fill="none" />
    {/* Apple */}
    <Path d="M435 148 Q425 143 420 153 Q413 168 420 186 Q425 199 435 199 Q445 199 450 186 Q457 168 450 153 Q445 143 435 148Z M435 146 Q437 136 443 133" stroke="rgba(255,255,255,0.32)" strokeWidth="2" fill="none" />
  </Svg>
);

const WaveSeparator = () => (
  <Svg width={width} height={60} style={{ position: "absolute", bottom: -1, left: 0 }}>
    <Path
      d={`M0,50 Q${width * 0.28},5 ${width * 0.52},32 Q${width * 0.76},58 ${width},18 L${width},60 L0,60 Z`}
      fill="#f0f4f8"
    />
  </Svg>
);

const UserPlusIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
    <Circle cx="10" cy="7" r="4" stroke="#2C5282" strokeWidth="1.8" />
    <Path d="M2 21c0-4 3.6-7 8-7s8 3 8 7" stroke="#2C5282" strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M19 8v6M16 11h6" stroke="#2C5282" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const PersonIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="7" r="4" stroke="#94a3b8" strokeWidth="1.8" />
    <Path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const MailIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="14" rx="2" stroke="#94a3b8" strokeWidth="1.8" />
    <Path d="M3 7l9 6 9-6" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const LockIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M7 11V7a5 5 0 0110 0v4" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1z" stroke="#94a3b8" strokeWidth="1.8" />
    <Circle cx="12" cy="16" r="1.2" fill="#94a3b8" />
  </Svg>
);

const EyeOffIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M1 1l22 22" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const LeafIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6 2 3 8 3 14c0 4 2.5 7 6 8 0-4 1-8 7-10-2 3-3 6-3 10 3.5-1 6-4.5 6-8 0-6-3-12-7-12z" stroke="#94a3b8" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
  </Svg>
);

const BackIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke="#2C4A6E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BLUE = "#7A9BBF";
const BTN_BLUE = "#4A6FA5";

const SignupScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allergenInput, setAllergenInput] = useState("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const addAllergen = () => {
    if (allergenInput.trim() === "") return;
    setAllergens([...allergens, allergenInput.trim()]);
    setAllergenInput("");
  };

  const removeAllergen = (index: number) => {
    setAllergens(allergens.filter((_, i) => i !== index));
  };

  const signup = async () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    let updatedAllergens = [...allergens];

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      Alert.alert("Signup Failed", "Please enter username, email and password");
      return;
    }
    if (trimmedUsername.length < 3) {
      Alert.alert("Signup Failed", "Username must be at least 3 characters");
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert("Signup Failed", "Please enter a valid email address");
      return;
    }
    if (trimmedPassword.length < 6) {
      Alert.alert("Signup Failed", "Password must be at least 6 characters");
      return;
    }
    if (allergenInput.trim() !== "") {
      updatedAllergens.push(allergenInput.trim());
    }
    updatedAllergens = Array.from(
      new Set(updatedAllergens.map((item) => item.trim()).filter(Boolean))
    );

    try {
      setIsSubmitting(true);
      await API.post("/auth/signup", {
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
        allergens: updatedAllergens,
      });
      Alert.alert("Success", "Account created successfully");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Signup Failed", getErrorMessage(error, "Signup failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* ── Blue Header ── */}
            <View style={styles.header}>
              <FoodIcons />
              {/* Back button */}
              {/* <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
              >
                <BackIcon />
              </TouchableOpacity> */}
              <WaveSeparator />
            </View>

            {/* ── User+ Badge ── */}
            <View style={styles.badgeWrapper}>
              <View style={styles.badgeCircle}>
                <UserPlusIcon />
              </View>
            </View>

            {/* ── White Body ── */}
            <View style={styles.body}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join FoodShield and make smarter{"\n"}food choices
              </Text>

              {/* ── Form Card ── */}
              <View style={styles.card}>
                {/* Username */}
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}><PersonIcon /></View>
                  <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                  />
                </View>

                {/* Email */}
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}><MailIcon /></View>
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}><LockIcon /></View>
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#94a3b8"
                    style={[styles.input, { flex: 1 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={styles.eyeIcon}
                  >
                    <EyeOffIcon />
                  </TouchableOpacity>
                </View>

                {/* Allergens */}
                <Text style={styles.allergenLabel}>
                  Add Allergens{" "}
                  <Text style={styles.allergenOptional}>(Optional)</Text>
                </Text>

                <View style={styles.allergenRow}>
                  <View style={[styles.inputWrapper, { flex: 1, marginBottom: 0, marginRight: 8 }]}>
                    <View style={styles.inputIcon}><LeafIcon /></View>
                    <TextInput
                      placeholder="Enter allergen"
                      value={allergenInput}
                      onChangeText={setAllergenInput}
                      placeholderTextColor="#94a3b8"
                      style={styles.input}
                      onSubmitEditing={addAllergen}
                      returnKeyType="done"
                    />
                  </View>
                  <TouchableOpacity style={styles.addBtn} onPress={addAllergen}>
                    <Text style={styles.addBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.allergenHint}>
                  Add allergens you want us to consider while scanning products.
                </Text>

                {/* Allergen chips */}
                {allergens.length > 0 && (
                  <View style={styles.chipsWrapper}>
                    {allergens.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.chip}
                        onPress={() => removeAllergen(index)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.chipText}>{item} ✕</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Divider */}
                <View style={styles.divider} />

                {/* Sign Up Button */}
                <TouchableOpacity
                  onPress={signup}
                  disabled={isSubmitting}
                  style={[styles.signupBtn, isSubmitting && { opacity: 0.7 }]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.signupBtnText}>
                    {isSubmitting ? "SIGNING UP..." : "SIGN UP"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login link */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.loginWrapper}
              >
                <Text style={styles.loginText}>
                  Already have an account?{" "}
                  <Text style={styles.loginLink}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BLUE,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#f0f4f8",
  },

  /* ── Header ── */
  header: {
    width: "100%",
    height: 110,
    backgroundColor: BLUE,
    position: "relative",
    overflow: "hidden",
  },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    zIndex: 10,
  },

  /* ── Badge ── */
  badgeWrapper: {
    alignItems: "center",
    marginTop: -36,
    zIndex: 10,
  },
  badgeCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#c7d8ec",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 3,
    borderColor: "#dce8f5",
  },

  /* ── Body ── */
  body: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a2e45",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },

  /* ── Card ── */
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 18,
  },

  /* ── Inputs ── */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dde4ef",
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: "#1a2e45",
  },
  eyeIcon: {
    padding: 4,
  },

  /* ── Allergens ── */
  allergenLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a2e45",
    marginBottom: 10,
    marginTop: 2,
  },
  allergenOptional: {
    fontWeight: "400",
    color: "#9ca3af",
    fontSize: 13,
  },
  allergenRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: "#c7d8ec",
    paddingHorizontal: 18,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    color: "#2C4A6E",
    fontWeight: "700",
    fontSize: 14.5,
  },
  allergenHint: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 8,
    lineHeight: 17,
  },
  chipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 6,
  },
  chip: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  chipText: {
    color: "#dc2626",
    fontSize: 12.5,
    fontWeight: "600",
  },

  /* ── Divider ── */
  divider: {
    height: 1,
    backgroundColor: "#e8eef5",
    marginVertical: 14,
    borderStyle: "dashed",
  },

  /* ── Sign Up Button ── */
  signupBtn: {
    backgroundColor: BTN_BLUE,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BTN_BLUE,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  signupBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1.5,
  },

  /* ── Login link ── */
  loginWrapper: {
    marginTop: 2,
  },
  loginText: {
    fontSize: 14,
    color: "#6b7280",
  },
  loginLink: {
    color: BTN_BLUE,
    fontWeight: "700",
  },
});

export default SignupScreen;