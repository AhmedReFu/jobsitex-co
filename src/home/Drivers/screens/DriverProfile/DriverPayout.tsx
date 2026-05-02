import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface PayoutItem {
  id: string
  type: string
  date: string
  amount: string
}

const DriverPayout = () => {
  const navigation = useNavigation()
  const [recentPayouts] = useState<PayoutItem[]>([
    {
      id: '1',
      type: 'Standard Payout',
      date: 'Oct 12, 2023 • 4:30 PM',
      amount: '$240.50',
    },
    {
      id: '2',
      type: 'Standard Payout',
      date: 'Oct 05, 2023 9:15 AM',
      amount: '$485.50',
    },
    {
      id: '3',
      type: 'Instant Payout',
      date: 'Sep 28, 2025 • 6:45 PM',
      amount: '$95.00',
    },
  ])

  const handleSettingStripe = () => {
    console.log('Setting Stripe Account')
    // Navigate to Stripe settings
  }

  const handleSeeAll = () => {
    console.log('See all payouts')
    // Navigate to all payouts
  }

  return (
    <SafeAreaView className='flex-1 ' edges={['top']}>
          {/* Header */}
          <StatusBar style='dark'/>
      <View className='px-4 py-4'>
        <View className='flex-row items-center'>
          <TouchableOpacity onPress={() => navigation.goBack()} className='p-2'>
            <Text className='text-3xl'>←</Text>
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-gray-dark ml-2'>Payout & Stripe</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        {/* Stripe Connected Card */}
        <View className='mx-5 mt-6 mb-6'>
          <View className='bg-white rounded-3xl p-5 border border-gray-200' style={{ elevation: 2 }}>
            <View className='flex-row items-center mb-3'>
              {/* Checkmark Icon */}
              <View className='w-10 h-10 rounded-full bg-green-500 items-center justify-center mr-3'>
                <Ionicons name='checkmark' size={20} color='white' />
              </View>

              {/* Text */}
              <View className='flex-1'>
                <Text className='text-xl font-bold text-gray-900'>Stripe: Connected</Text>
              </View>

              {/* Active Badge */}
              <Text className='text-green-500 font-bold text-base'>Active</Text>
            </View>

            {/* Description */}
            <Text className='text-gray-400 text-sm ml-13 leading-5'>
              Your account is linked and ready to receive automatic payouts.
            </Text>
          </View>
        </View>

        {/* Payout Info Cards */}
        <View className='mx-5 flex-row gap-3 mb-8'>
          {/* Last Payout */}
          <View className='flex-1 bg-white rounded-2xl p-5 border border-gray-200' style={{ elevation: 2 }}>
            <Text className='text-gray-400 text-sm mb-2'>Last Payout</Text>
            <Text className='text-xl font-bold text-gray-900'>Oct 12, 2023</Text>
          </View>

          {/* Next Payout */}
          <View className='flex-1 bg-white rounded-2xl p-5 border border-gray-200' style={{ elevation: 2 }}>
            <Text className='text-green-500 font-bold text-sm mb-2'>Next Payout</Text>
            <Text className='text-2xl font-bold text-gray-900'>$150.00</Text>
          </View>
        </View>

        {/* Recent Payouts Header */}
        <View className='mx-5 flex-row items-center justify-between mb-4'>
          <Text className='text-2xl font-bold text-gray-dark'>Recent Payouts</Text>
          <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.7}>
            <Text className='text-green-500 font-bold text-base'>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Payout List */}
        <View className='mx-5 mb-8'>
          {recentPayouts.map((payout) => (
            <TouchableOpacity
              key={payout.id}
              className='bg-white rounded-2xl p-5 border border-gray-200 mb-3 flex-row items-center justify-between'
              style={{ elevation: 2 }}
              activeOpacity={0.7}
            >
              <View className='flex-1'>
                <Text className='text-lg font-bold text-gray-900 mb-1'>{payout.type}</Text>
                <Text className='text-sm text-gray-400'>{payout.date}</Text>
              </View>
              <Text className='text-xl font-bold text-gray-900'>{payout.amount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Setting Stripe Account Button */}
        <View className='mx-5 mb-4'>
          <TouchableOpacity
            onPress={handleSettingStripe}
            className='bg-green-500 rounded-2xl py-5 flex-row items-center justify-center'
            style={{ elevation: 4 }}
            activeOpacity={0.8}
          >
            <FontAwesome name='credit-card' size={24} color='white' />
            <Text className='text-white font-bold text-lg ml-3'>Setting Stripe Account</Text>
          </TouchableOpacity>
        </View>

        {/* Security Footer */}
        <View className='mx-5 pb-8 flex-row items-center'>
          <Ionicons name='lock-closed' size={20} color='#9CA3AF' />
          <Text className='text-gray-400 text-sm ml-2'>Payments are secured by Stripe</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DriverPayout