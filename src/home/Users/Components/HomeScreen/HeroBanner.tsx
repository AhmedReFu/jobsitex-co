import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Images } from '../../../../constants'

interface HeroBannerProps {
  onBookPress: () => void
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onBookPress }) => (
  <View className="mb-2 rounded-3xl overflow-hidden">
    <LinearGradient colors={["#C9CD07", "#4CAF50"]} style={{ flex: 1 }}>
      <View className="p-5 flex-row items-center">
        <View className="flex-1">
          <Text className="text-white text-3xl font-bold mb-2">
            Book a Truck{"\n"}Now
          </Text>
          <Text className="text-white text-xl mb-10 opacity-90">
            Reliable delivery in minutes.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onBookPress}
            className="bg-[#BDCA0E] px-6 py-3 rounded-2xl max-w-56"
          >
            <Text className="text-white font-bold text-lg">
              START BOOKING →
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={Images.TruckIlastration}
          resizeMode="contain"
          style={{ position: "absolute", right: 0 }}
        />
      </View>
    </LinearGradient>
  </View>
)