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
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/api";
import { RootRoutes } from "../navigation/Routes";
import Svg, { Path, Circle, Ellipse } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const getErrorMessage = (error: any, fallback: string) => {
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0)
    return detail.map((item) => item?.msg).filter(Boolean).join("\n");
  return fallback;
};

// Dot grid component for corner decoration
const DotGrid = ({ style }: { style?: any }) => {
  const dots = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      dots.push(
        <View
          key={`${r}-${c}`}
          style={[styles.dot, { top: r * 12, left: c * 12 }]}
        />
      );
    }
  }
  return <View style={[styles.dotGrid, style]}>{dots}</View>;
};

// Food icon SVG paths (simplified outline icons)
const FoodIcons = () => (
  <Svg
    width={width}
    height={180}
    style={{ position: "absolute", top: 0, left: 0 }}
  >
    {/* Broccoli */}
    <Path
      d="M160 80 Q165 60 175 58 Q185 56 188 68 Q195 58 205 62 Q210 75 200 82 Q195 90 180 88 Q168 90 160 80Z M178 88 L180 108"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="2"
      fill="none"
    />
    {/* Leaf */}
    <Path
      d="M250 110 Q270 90 290 100 Q280 130 255 130 Q245 125 250 110Z M252 128 Q248 140 250 148"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="2"
      fill="none"
    />
    {/* Jar */}
    <Path
      d="M360 60 L380 60 Q385 60 385 65 L385 100 Q385 108 378 108 L362 108 Q355 108 355 100 L355 65 Q355 60 360 60Z M357 70 L383 70 M363 57 L377 57"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="2"
      fill="none"
    />
    {/* Milk carton */}
    <Path
      d="M75 130 L75 185 L110 185 L110 130 L92 115 Z M75 130 L92 115 L110 130"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="2"
      fill="none"
    />
    {/* Carrot */}
    <Path
      d="M330 155 Q340 170 335 200 Q330 215 325 210 Q320 205 325 185 Q322 170 330 155Z M330 155 Q325 145 328 140 M330 155 Q335 145 337 140 M330 155 Q330 143 332 138"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="2"
      fill="none"
    />
    {/* Apple */}
    <Path
      d="M380 160 Q370 155 365 165 Q358 180 365 200 Q370 215 380 215 Q390 215 395 200 Q402 180 395 165 Q390 155 380 160Z M380 158 Q382 148 388 145"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

// Wave separator between blue header and white body
const WaveSeparator = () => (
  <Svg
    width={width}
    height={70}
    style={{ position: "absolute", top: 190, left: 0 }}
  >
    <Path
      d={`M0,60 Q${width * 0.25},10 ${width * 0.5},40 Q${width * 0.75},70 ${width},20 L${width},0 L0,0 Z`}
      fill="#7A9BBF"
    />
    <Path
      d={`M0,70 Q${width * 0.3},20 ${width * 0.55},50 Q${width * 0.78},75 ${width},30 L${width},0 L0,0 Z`}
      fill="#8BADD0"
    />
    <Path
      d={`M0,70 Q${width * 0.35},30 ${width * 0.6},55 Q${width * 0.82},75 ${width},35 L${width},70 Z`}
      fill="#f0f4f8"
    />
  </Svg>
);

// Shield icon with checkmark
const ShieldIcon = () => (
  <Svg width={52} height={56} viewBox="0 0 52 56">
    <Path
      d="M26 2 L46 10 L46 28 Q46 44 26 54 Q6 44 6 28 L6 10 Z"
      fill="none"
      stroke="#2C5282"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <Path
      d="M16 28 L22 34 L36 20"
      stroke="#2C5282"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

// Google G logo
const GoogleG = () => (
  <Svg width={22} height={22} viewBox="0 0 48 48">
    <Path
      d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
      fill="#4285F4"
    />
    <Path
      d="M6.3 14.7l7 5.1C15.2 16.5 19.3 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"
      fill="#EA4335"
    />
    <Path
      d="M24 46c5.9 0 10.9-1.9 14.6-5.2l-6.7-5.5C29.9 36.6 27.1 37 24 37c-6.1 0-10.7-3.1-11.8-7.5L5.2 35c3.4 7.1 10 11 18.8 11z"
      fill="#34A853"
    />
    <Path
      d="M44.5 20H24v8.5h11.8c-.8 2.7-2.6 5-5 6.5l6.7 5.5C41.5 36.8 45 31 45 24c0-1.3-.2-2.7-.5-4z"
      fill="#FBBC05"
    />
  </Svg>
);

// Person icon for username field
const PersonIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="7" r="4" stroke="#94a3b8" strokeWidth="1.8" />
    <Path
      d="M4 21c0-4 3.6-7 8-7s8 3 8 7"
      stroke="#94a3b8"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

// Lock icon for password field
const LockIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 11V7a5 5 0 0110 0v4"
      stroke="#94a3b8"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M5 11h14a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1z"
      stroke="#94a3b8"
      strokeWidth="1.8"
    />
    <Circle cx="12" cy="16" r="1.2" fill="#94a3b8" />
  </Svg>
);

// Eye-off icon for password visibility toggle
const EyeOffIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
      stroke="#94a3b8"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M1 1l22 22"
      stroke="#94a3b8"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    const loginId = email.trim();
    const trimmedPassword = password.trim();
    if (!loginId || !trimmedPassword) {
      Alert.alert("Login Failed", "Please enter username/email and password");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await API.post("/auth/login", {
        email: loginId,
        password: trimmedPassword,
      });
      const token = res.data.access_token;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("user_id", String(res.data.user_id));
      navigation.replace(RootRoutes.MainTabs);
    } catch (error: any) {
      if (error.response) {
        Alert.alert(
          "Login Failed",
          getErrorMessage(error, "Invalid username/email or password")
        );
      } else {
        Alert.alert("Login Failed", "Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Blue header section */}
        <View style={styles.header}>
          <FoodIcons />
          <DotGrid style={styles.dotTopLeft} />
          {/* Wave at bottom of header */}
          <WaveSeparator />
        </View>

        {/* Shield badge overlapping the wave */}
        <View style={styles.shieldWrapper}>
          <View style={styles.shieldCircle}>
            <ShieldIcon />
          </View>
        </View>

        {/* White body */}
        <View style={styles.body}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to continue making{"\n"}smarter food choices
          </Text>

          {/* Form card */}
          <View style={styles.card}>
            {/* Username field */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <PersonIcon />
              </View>
              <TextInput
                placeholder="Username"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password field */}
            <View style={[styles.inputWrapper, { marginBottom: 6 }]}>
              <View style={styles.inputIcon}>
                <LockIcon />
              </View>
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

            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotWrapper}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login button */}
            <TouchableOpacity
              onPress={login}
              disabled={isSubmitting}
              style={[styles.loginBtn, isSubmitting && { opacity: 0.7 }]}
              activeOpacity={0.85}
            >
              <Text style={styles.loginBtnText}>
                {isSubmitting ? "LOGGING IN..." : "LOGIN"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            {/* <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View> */}

            {/* Google button */}
            {/* <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
              <GoogleG />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity> */}
          </View>

          {/* Sign up link */}
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            style={styles.signUpWrapper}
          >
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

          <DotGrid style={styles.dotBottomRight} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const BLUE = "#7A9BBF";
const DARK_BLUE = "#2C4A6E";
const BTN_BLUE = "#4A6FA5";

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
    height: 160,
    backgroundColor: BLUE,
    overflow: "hidden",
    position: "relative",
  },

  /* ── Shield badge ── */
  shieldWrapper: {
    alignItems: "center",
    marginTop: -38,
    zIndex: 10,
  },
  shieldCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    paddingTop: 20,
    paddingBottom: 40,
    position: "relative",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a2e45",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14.5,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  /* ── Card ── */
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 20,
  },

  /* ── Input fields ── */
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dde4ef",
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1a2e45",
  },
  eyeIcon: {
    padding: 4,
  },

  /* ── Forgot password ── */
  forgotWrapper: {
    alignSelf: "flex-end",
    marginBottom: 18,
  },
  forgotText: {
    color: BTN_BLUE,
    fontSize: 13.5,
    fontWeight: "600",
  },

  /* ── Login button ── */
  loginBtn: {
    backgroundColor: BTN_BLUE,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: BTN_BLUE,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1.5,
  },

  /* ── Divider ── */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9ca3af",
    fontSize: 13,
  },

  /* ── Google button ── */
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dde4ef",
    height: 52,
    gap: 10,
    backgroundColor: "#fff",
  },
  googleBtnText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },

  /* ── Sign up ── */
  signUpWrapper: {
    marginTop: 4,
  },
  signUpText: {
    fontSize: 14,
    color: "#6b7280",
  },
  signUpLink: {
    color: BTN_BLUE,
    fontWeight: "700",
  },

  /* ── Dot grids ── */
  dotGrid: {
    position: "absolute",
    width: 60,
    height: 60,
  },
  dotTopLeft: {
    top: 16,
    left: 16,
  },
  dotBottomRight: {
    bottom: 20,
    right: 8,
  },
  dot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(74,111,165,0.25)",
  },
});

export default LoginScreen;