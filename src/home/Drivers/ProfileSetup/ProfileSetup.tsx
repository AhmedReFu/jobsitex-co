import { IMAGE_DRIVER_PROFILE, IPA_BASE, PROFILE_UPDATE } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast, useToast } from "../../../Components/useToost";
import { AuthStackParamList } from "../../../Navigation/type";

// ✅ enums (backend enum match)
const VEHICLE_TYPES = [
  "Truck",
  "Van",
  "Trailer",
  "Flatbed",
  "Refrigerated",
  "Tanker",
  "Container",
  "Other",
] as const;
type VehicleType = (typeof VEHICLE_TYPES)[number];

const PAYLOAD_CAPACITIES = [
  "0 - 1 Ton",
  "1 - 3 Ton",
  "3 - 5 Ton",
  "5 - 10 Ton",
  "10+ Ton",
  "Other",
] as const;
type PayloadCapacity = (typeof PAYLOAD_CAPACITIES)[number];

type AxleValue = 2 | 3 | 4 | "Other";

// ─── Select Modal ─────────────────────────────────────────────────────────────

const SelectModal = ({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: readonly string[];
  selected?: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable className="bg-white rounded-t-3xl px-5 pt-4 pb-8" onPress={() => { }}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-black text-gray-900">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 380 }}>
            {options.map((opt) => {
              const active = selected === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => {
                    onSelect(opt);
                    onClose();
                  }}
                  activeOpacity={0.85}
                  className={`py-4 px-4 rounded-2xl mb-2 border ${active ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
                    }`}
                >
                  <Text className={`${active ? "text-green-700 font-bold" : "text-gray-900"}`}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL = IPA_BASE;
const END_POINTS = { PROFILE_UPDATE, IMAGE_DRIVER_PROFILE };

// ─── Component ────────────────────────────────────────────────────────────────

const ProfileSetup = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const toast = useToast();
  const route = useRoute<any>();
  const accessToken = route.params.accessToken;

  // ── State ──────────────────────────────────────────────────────────────────
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [truckType, setTruckType] = useState<VehicleType | "">("");
  const [payloadCapacity, setPayloadCapacity] = useState<PayloadCapacity | "">("");
  const [axleCount, setAxleCount] = useState<AxleValue>(3);
  const [axleOther, setAxleOther] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [truckModal, setTruckModal] = useState(false);
  const [payloadModal, setPayloadModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Image Picker ─────────────────────────────────────────────────────────

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery permission allow koro.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // ─── Validation ───────────────────────────────────────────────────────────

  const validate = () => {
    const next: Record<string, string> = {};

    if (!truckType) next.truckType = "Truck type select koro.";
    if (!payloadCapacity) next.payloadCapacity = "Payload capacity select koro.";

    if (axleCount === "Other") {
      const n = Number(axleOther);
      if (!axleOther) next.axleOther = "Axle number dao.";
      else if (!Number.isFinite(n) || n < 1) next.axleOther = "Valid axle number dao (>=1).";
    }

    const rate = Number(hourlyRate);
    if (!hourlyRate) next.hourlyRate = "Hourly rate dao.";
    else if (!Number.isFinite(rate) || rate <= 0)
      next.hourlyRate = "Valid hourly rate dao (e.g. 15 বা 15.50).";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const canSubmit = useMemo(() => {
    if (!truckType || !payloadCapacity || !hourlyRate) return false;
    const rate = Number(hourlyRate);
    if (!Number.isFinite(rate) || rate <= 0) return false;
    if (axleCount === "Other") {
      const n = Number(axleOther);
      if (!Number.isFinite(n) || n < 1) return false;
    }
    return true;
  }, [truckType, payloadCapacity, hourlyRate, axleCount, axleOther]);

  // ─── Submit ───────────────────────────────────────────────────────────────
  //
  //  Step 1 → IMAGE_DRIVER_PROFILE  (multipart/form-data)  — only if photo selected
  //  Step 2 → PROFILE_UPDATE        (JSON)                  — always
  //

  const handleNext = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // ── Step 1: Upload profile image ───────────────────────────────────────
      if (photoUri) {
        const formData = new FormData();

        // React Native FormData image format
        formData.append("image", {
          uri: photoUri,
          type: "image/jpeg",
          name: "profile.jpg",
        } as any);

        await axios.patch(
          `${API_BASE_URL}${END_POINTS.IMAGE_DRIVER_PROFILE}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data", // ← image upload এ must
            },
            timeout: 15000,
          }
        );
      }

    // ── Step 2: Update profile details ────────────────────────────────────
      const payload = {
        vehicleType: truckType,
        vehicleCapacity: payloadCapacity,
        vehicleColor: axleCount === "Other" ? Number(axleOther) : axleCount,
        hourRate: Number(hourlyRate),
      };

      const res = await axios.post(
        `${API_BASE_URL}${END_POINTS.PROFILE_UPDATE}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          timeout: 15000,
        }
      );

      const data = res?.data;
      console.log("Response:", data);

      if (data?.success === true) {
        toast.show({
          message: data?.message || "Profile updated successfully",
          type: "success",
          style: "top",
        });

        (navigation as any).navigate("RequiredDocuments", { accessToken });
      } else {
        toast.show({
          message: data?.message || "Update failed",
          type: "error",
          style: "top",
        });
      }
    } catch (error: any) {
      console.log("Request failed:", error);
      console.log("Server response:", error?.response?.data);

      toast.show({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
        type: "error",
        style: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-5 py-2 bg-gray-50">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-black text-gray-900">Profile Setup</Text>
      </View>

      {/* Modals */}
      <SelectModal
        visible={truckModal}
        title="Select truck type"
        options={VEHICLE_TYPES}
        selected={truckType || undefined}
        onSelect={(v) => setTruckType(v as VehicleType)}
        onClose={() => setTruckModal(false)}
      />
      <SelectModal
        visible={payloadModal}
        title="Select payload capacity"
        options={PAYLOAD_CAPACITIES}
        selected={payloadCapacity || undefined}
        onSelect={(v) => setPayloadCapacity(v as PayloadCapacity)}
        onClose={() => setPayloadModal(false)}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-5">

          {/* ── Upload Photo ── */}
          <View className="items-center mb-6">
            <View style={{ position: "relative" }}>
              <View
                className="w-44 h-44 rounded-full bg-white items-center justify-center overflow-hidden"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                {photoUri ? (
                  <Image
                    source={{ uri: photoUri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={80} color="#D1D5DB" />
                )}
              </View>

              <TouchableOpacity
                style={{ position: "absolute", right: 4, bottom: 4 }}
                activeOpacity={0.8}
                onPress={pickImage}
              >
                <View
                  className="w-12 h-12 rounded-full bg-green-500 items-center justify-center border-4 border-white"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Ionicons name="image-outline" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-xl font-bold text-center text-gray-900 mb-10">
            Upload your photo
          </Text>

          {/* ── Truck Details ── */}
          <View className="mb-6">
            <Text className="text-2xl font-black text-gray-900 mb-2">Truck Details</Text>
            <Text className="text-gray-500 text-base mb-6 leading-5">
              Tell us about the vehicle you will be driving to help us match you with the right loads.
            </Text>

            {/* Truck Type dropdown */}
            <TouchableOpacity
              className="border border-gray-300 rounded-2xl px-4 py-4 mb-2 flex-row items-center justify-between bg-white"
              activeOpacity={0.7}
              onPress={() => setTruckModal(true)}
            >
              <View className="flex-row items-center">
                <Ionicons name="car-outline" size={24} color="#9CA3AF" />
                <Text
                  className={`${truckType ? "text-gray-900" : "text-gray-400"} text-base ml-3`}
                >
                  {truckType || "Select truck type.."}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            {!!errors.truckType && (
              <Text className="text-red-500 mb-3">{errors.truckType}</Text>
            )}

            {/* Payload dropdown */}
            <TouchableOpacity
              className="border border-gray-300 rounded-2xl px-4 py-4 mb-2 flex-row items-center justify-between bg-white"
              activeOpacity={0.7}
              onPress={() => setPayloadModal(true)}
            >
              <View className="flex-row items-center">
                <Ionicons name="scale-outline" size={24} color="#9CA3AF" />
                <Text
                  className={`${payloadCapacity ? "text-gray-900" : "text-gray-400"} text-base ml-3`}
                >
                  {payloadCapacity || "Select Payload Capacity"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            {!!errors.payloadCapacity && (
              <Text className="text-red-500 mb-3">{errors.payloadCapacity}</Text>
            )}

            {/* Axle Count */}
            <View className="mb-4 mt-2">
              <Text className="text-lg font-bold text-gray-900 mb-3">Axle Count</Text>
              <View className="flex-row justify-between gap-3">
                {[2, 3, 4].map((count) => (
                  <TouchableOpacity
                    key={count}
                    onPress={() => {
                      setAxleCount(count as 2 | 3 | 4);
                      setAxleOther("");
                      setErrors((p) => ({ ...p, axleOther: "" }));
                    }}
                    className={`flex-1 py-4 rounded-2xl border-2 items-center justify-center ${axleCount === count
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-white"
                      }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`font-bold text-2xl ${axleCount === count ? "text-green-600" : "text-gray-900"
                        }`}
                    >
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  onPress={() => setAxleCount("Other")}
                  className={`flex-1 py-4 rounded-2xl border-2 items-center justify-center ${axleCount === "Other"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-white"
                    }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`font-semibold text-base ${axleCount === "Other" ? "text-green-600" : "text-gray-900"
                      }`}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
              </View>

              {axleCount === "Other" && (
                <View className="mt-3">
                  <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 py-4 bg-white">
                    <Ionicons name="git-branch-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 ml-3 text-base text-gray-900"
                      placeholder="Enter axle count (e.g. 5)"
                      keyboardType="number-pad"
                      value={axleOther}
                      onChangeText={(t) => setAxleOther(t.replace(/[^0-9]/g, ""))}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  {!!errors.axleOther && (
                    <Text className="text-red-500 mt-2">{errors.axleOther}</Text>
                  )}
                </View>
              )}
            </View>

            {/* Hourly Rate */}
            <View>
              <Text className="text-lg font-bold text-gray-900 mb-3">Hourly Rate</Text>
              <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 py-4 bg-white">
                <Text className="text-2xl text-gray-600 mr-3 font-normal">$</Text>
                <TextInput
                  placeholder="0.00"
                  value={hourlyRate}
                  onChangeText={(t) => {
                    const cleaned = t.replace(/[^0-9.]/g, "");
                    const parts = cleaned.split(".");
                    const normalized =
                      parts.length <= 2
                        ? parts.length === 2
                          ? `${parts[0]}.${parts[1]}`
                          : parts[0]
                        : `${parts[0]}.${parts.slice(1).join("")}`;
                    setHourlyRate(normalized);
                  }}
                  keyboardType="decimal-pad"
                  className="flex-1 text-base text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
                <Text className="text-gray-900 text-base font-normal">Per hour</Text>
              </View>
              {!!errors.hourlyRate && (
                <Text className="text-red-500 mt-2">{errors.hourlyRate}</Text>
              )}
            </View>
          </View>

          {/* ── Next Button ── */}
          <TouchableOpacity
            className={`rounded-2xl py-5 items-center flex-row justify-center ${canSubmit && !isSubmitting ? "bg-green-500" : "bg-gray-300"
              }`}
            activeOpacity={0.85}
            onPress={handleNext}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                  <Text className="text-white font-bold text-lg mr-2">NEXT STEP</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>

      <Toast
        style={toast.style}
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        fadeAnim={toast.fadeAnim}
        buttons={toast.buttons}
        onHide={toast.hide}
      />
    </SafeAreaView>
  );
};

export default ProfileSetup;