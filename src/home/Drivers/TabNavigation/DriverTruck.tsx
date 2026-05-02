import { Entypo, MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ImageBackground, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../../Navigation/type'

const DriverTruck = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const [jobData] = useState({
    status: 'ON THE WAY',
    eta: 12,
    pickupTime: '4:45 PM',
    distance: '2.3 km',
    vehicle: '53\' Dry Van',
    plate: '#TDX-9921',
    pickup: '123 Industrial Park Rd, Chicago, IL 60601',
  })

  const handleArrived = () => {
    navigation.navigate('CurrentJob', { jobId: '1' })
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      <StatusBar barStyle='dark-content' />

      {/* Map Section */}
      <View className='flex-1 bg-gray-200'>
        <ImageBackground
          source={{ uri: 'https://via.placeholder.com/400x600/E0E7FF/6366F1?text=Live+Tracking+Map' }}
          className='flex-1'
          resizeMode='cover'
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='absolute top-4 left-4 bg-white rounded-full p-2'
            style={{ elevation: 4 }}
          >
            <Entypo name='chevron-left' size={28} color='#111827' />
          </TouchableOpacity>
          <Text className='absolute top-4 right-4 text-white font-bold text-lg'>Live Tracking</Text>
        </ImageBackground>
      </View>

      {/* Bottom Sheet */}
      <View className='bg-white rounded-t-3xl px-5 py-6 mb-20' style={{ elevation: 5 }}>
        {/* Status Row */}
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-row items-center gap-2'>
            <View className='w-3 h-3 rounded-full bg-green-500' />
            <Text className='text-sm font-bold text-green-600'>{jobData.status}</Text>
          </View>
          <View className='flex-row items-center gap-1'>
            <MaterialIcons name='schedule' size={16} color='#F59E0B' />
            <Text className='text-lg font-bold text-orange-500'>{jobData.pickupTime}</Text>
          </View>
        </View>

        {/* ETA and Distance */}
        <View className='flex-row gap-3 mb-6'>
          <View className='flex-1 bg-orange-50 rounded-2xl p-4'>
            <Text className='text-xs text-gray-600 mb-1'>To Pickup</Text>
            <Text className='text-2xl font-bold text-orange-500'>{jobData.eta} min</Text>
          </View>
          <View className='flex-1 bg-gray-50 rounded-2xl p-4'>
            <Text className='text-xs text-gray-600 mb-1'>Distance</Text>
            <Text className='text-2xl font-bold text-gray-900'>{jobData.distance}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className='mb-6'>
          <View className='flex-row items-center justify-between mb-2'>
            <Text className='text-xs font-semibold text-gray-600'>Driver</Text>
            <Text className='text-xs font-semibold text-gray-600'>Pickup</Text>
          </View>
          <View className='h-2 bg-gray-200 rounded-full overflow-hidden'>
            <View className='h-full bg-gradient-to-r from-green-500 to-orange-500 w-1/3' />
          </View>
        </View>

        {/* Pickup Location */}
        <View className='bg-gray-50 rounded-2xl p-4 mb-6'>
          <View className='flex-row items-start gap-3'>
            <View className='w-8 h-8 rounded-full bg-orange-100 items-center justify-center mt-1'>
              <MaterialIcons name='location-on' size={16} color='#F59E0B' />
            </View>
            <View className='flex-1'>
              <Text className='text-xs font-bold text-gray-600 mb-1'>PICKUP LOCATION</Text>
              <Text className='text-base font-semibold text-gray-900'>{jobData.pickup}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Info */}
        <View className='flex-row gap-3 mb-6'>
          <View className='flex-1 bg-white border border-gray-200 rounded-2xl p-3'>
            <Text className='text-xs text-gray-600 mb-1'>VEHICLE</Text>
            <Text className='text-sm font-bold text-gray-900'>{jobData.vehicle}</Text>
          </View>
          <View className='flex-1 bg-white border border-gray-200 rounded-2xl p-3'>
            <Text className='text-xs text-gray-600 mb-1'>PLATE</Text>
            <Text className='text-sm font-bold text-gray-900'>{jobData.plate}</Text>
          </View>
        </View>

        {/* Arrival Button */}
        <TouchableOpacity
          onPress={handleArrived}
          className='bg-green-500 rounded-2xl py-4 items-center justify-center'
          style={{ elevation: 3 }}
        >
          <Text className='text-white font-bold text-lg'>ARRIVED AT PICKUP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default DriverTruck
