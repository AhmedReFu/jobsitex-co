// UserSelectTruck.tsx - Horizontal Slider Version

import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
  FlatList
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../../../constants'
import { AuthStackParamList } from '../../../../Navigation/type'
import { useBooking } from '../../../../Auth/BookingContext'

interface TruckType {
  id: string
  name: string
  capacity: string
  description: string
  basePrice: number
  pricePerKm: number
  icon: any
  iconName: string
  iconBg: string
  iconColor: string
  category: 'mini' | 'pickup' | 'large' | 'van' | 'container'
}

const CARD_WIDTH = 280

const UserSelectTruck = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const {
    pickupLocation,
    dropoffLocation,
    routeData,
    selectedTruck,
    setSelectedTruck,
    setEstimatedPrice,
    setDistance,
    setDuration
  } = useBooking()

  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(
    selectedTruck?.id || null
  )
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const truckTypes: TruckType[] = [
    {
      id: '1',
      name: 'Mini Truck',
      capacity: '~ 1.8 Ton',
      description: 'Perfect for small moves and deliveries',
      basePrice: 20,
      pricePerKm: 2.0,
      icon: Images.Car1,
      iconName: 'truck',
      iconBg: '#E8F5E9',
      iconColor: '#4CAF50',
      category: 'mini'
    },
    {
      id: '2',
      name: 'Pickup Truck',
      capacity: '~ 1.2 Ton',
      description: 'Ideal for furniture and appliances',
      basePrice: 25,
      pricePerKm: 2.5,
      icon: Images.Car2,
      iconName: 'truck-pickup',
      iconBg: '#E3F2FD',
      iconColor: '#2196F3',
      category: 'pickup'
    },
    {
      id: '3',
      name: 'Large Truck',
      capacity: '~ 5 Ton',
      description: 'For heavy and bulk items',
      basePrice: 40,
      pricePerKm: 3.5,
      icon: Images.Car3,
      iconName: 'truck-trailer',
      iconBg: '#FFEBEE',
      iconColor: '#FF5252',
      category: 'large'
    },
    {
      id: '4',
      name: 'Cargo Van',
      capacity: '~ 0.8 Ton',
      description: 'Enclosed van for secure transport',
      basePrice: 18,
      pricePerKm: 1.8,
      icon: Images.Car1,
      iconName: 'truck-delivery',
      iconBg: '#FFF3E0',
      iconColor: '#FF9800',
      category: 'van'
    },
    {
      id: '5',
      name: 'Container Truck',
      capacity: '~ 10 Ton',
      description: 'For large commercial shipments',
      basePrice: 60,
      pricePerKm: 4.5,
      icon: Images.Car3,
      iconName: 'truck-cargo-container',
      iconBg: '#F3E5F5',
      iconColor: '#9C27B0',
      category: 'container'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Trucks' },
    { id: 'mini', name: 'Mini' },
    { id: 'pickup', name: 'Pickup' },
    { id: 'large', name: 'Large' },
    { id: 'van', name: 'Van' },
    { id: 'container', name: 'Container' }
  ]

  const filteredTrucks =
    activeCategory === 'all'
      ? truckTypes
      : truckTypes.filter((t) => t.category === activeCategory)

  const calculateEstimatedPrice = (truck: TruckType) => {
    if (!routeData?.distance) return truck.basePrice
    const distanceCost = routeData.distance * truck.pricePerKm
    const serviceCharge = (truck.basePrice + distanceCost) * 0.1
    return Math.round((truck.basePrice + distanceCost + serviceCharge) * 100) / 100
  }

  const handleTruckSelect = (truck: TruckType) => {
    setSelectedTruckId(truck.id)

    const estimatedPriceValue = calculateEstimatedPrice(truck)

    setSelectedTruck({
      id: truck.id,
      name: truck.name,
      capacity: truck.capacity,
      description: truck.description,
      iconBg: truck.iconBg,
      iconColor: truck.iconColor,
      hourlyRate: truck.pricePerKm,
      basePrice: truck.basePrice
    })

    setEstimatedPrice(estimatedPriceValue)
    if (routeData?.distance) setDistance(routeData.distance)
    if (routeData?.duration) setDuration(routeData.duration)
  }

  const handleConfirm = () => {
    if (!selectedTruckId) {
      Alert.alert('Select Truck', 'Please select a truck type to continue')
      return
    }

    if (!pickupLocation || !dropoffLocation) {
      Alert.alert('Missing Info', 'Please select pickup and dropoff locations')
      navigation.goBack()
      return
    }

    navigation.navigate('UserOrderDetails')
  }

  const renderTruck = ({ item: truck }: { item: TruckType }) => {
    const isSelected = selectedTruckId === truck.id
    const estimatedPrice = calculateEstimatedPrice(truck)

    return (
      <TouchableOpacity
        onPress={() => handleTruckSelect(truck)}
        activeOpacity={0.85}
        style={{ width: CARD_WIDTH }}
        className={`rounded-2xl p-4 ${isSelected
          ? 'border-2 border-green-500 bg-green-50'
          : 'border border-gray-200 bg-white'
          }`}
      >
        <View className='flex-row gap-3'>
          <View
            className="h-16 w-16 rounded-xl items-center justify-center mb-3"
            style={{ backgroundColor: truck.iconBg }}
          >
            <Image source={truck.icon} className="h-12 w-12" resizeMode="contain" />
          </View>

          <View >
            <Text className="text-lg font-bold text-gray-800">{truck.name}</Text>

            <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
              {truck.description}
            </Text>

            {/* <Text className="text-sm font-bold text-green-600 mt-2">
          Est. ${estimatedPrice}
        </Text> */}


          </View>

        </View>
        {isSelected && (
          <View className="absolute top-3 right-3 h-6 w-6 rounded-full bg-green-500 items-center justify-center">
            <MaterialCommunityIcons name="check" size={14} color="white" />
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">SELECT TRUCK</Text>
          <View className="w-7" />
        </View>

        {/* Location Summary */}
        <View className="mx-5 my-6 rounded-2xl bg-white border border-gray-200 p-4">
          <Text className="text-sm font-bold text-gray-800">
            {pickupLocation?.address || 'Pickup not selected'}
          </Text>
          <Text className="text-sm text-gray-500 mt-2">
            {dropoffLocation?.address || 'Dropoff not selected'}
          </Text>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-4">
          <View className="flex-row gap-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                className={`px-5 py-2 rounded-full ${activeCategory === category.id
                  ? 'bg-green-500'
                  : 'bg-gray-100 border border-gray-300'
                  }`}
              >
                <Text
                  className={`font-semibold ${activeCategory === category.id ? 'text-white' : 'text-gray-700'
                    }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Horizontal Truck Slider */}
        <FlatList
          data={filteredTrucks}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderTruck}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          snapToInterval={CARD_WIDTH + 12}
          decelerationRate="fast"
        />

        {/* Confirm */}
        <View className="px-5 py-6 mb-8">
          <TouchableOpacity
            onPress={handleConfirm}
            className="rounded-2xl bg-green-500 py-4"
          >
            <Text className="text-center text-lg font-bold text-white">
              CONFIRM
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserSelectTruck