import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const DriverEarnings = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week')

  const earningsData = {
    total: '$4,250.00',
    percentage: '+12%',
    breakdown: {
      hourBased: '$2,150.00',
      totalJobs: '120 Jobs',
    },
    paymentStatus: {
      pending: '$120.00',
      paid: '$2,150.00',
    },
  }

  return (
      <SafeAreaView className='flex-1 ' edges={['top']}>
          <StatusBar style='dark'/>
      {/* Header */}
      <View className='px-5 py-2 '>
        <View className='flex-row items-center'>
          <TouchableOpacity onPress={() => navigation.goBack()} className='p-2'>
            <Text className='text-3xl'>←</Text>
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-gray-dark ml-2'>Earnings</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        {/* Total Earnings Card */}
        <View className='mx-5 mt-6 mb-6'>
          <View className=' rounded-3xl p-8  items-center'                >
            {/* Label */}
            <Text className='text-gray-400 text-sm font-bold tracking-wider mb-2'>
              TOTAL EARNINGS
            </Text>

            {/* Amount */}
            <Text className='text-5xl font-bold text-gray-900 mb-2'>
              {earningsData.total}
            </Text>

            {/* Percentage */}
            <Text className='text-lg font-semibold text-green-500'>
              {earningsData.percentage} vs last week
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className='mx-5 flex-row gap-4 mb-8'>
          <TouchableOpacity
            onPress={() => setActiveTab('week')}
            className={`flex-1 py-4 rounded-2xl items-center justify-center border-2 ${
              activeTab === 'week'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
            style={{ elevation: activeTab === 'week' ? 3 : 1 }}
            activeOpacity={0.7}
          >
            <Text
              className={`text-lg font-bold ${
                activeTab === 'week' ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              This Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('month')}
            className={`flex-1 py-4 rounded-2xl items-center justify-center border-2 ${
              activeTab === 'month'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
            style={{ elevation: activeTab === 'month' ? 3 : 1 }}
            activeOpacity={0.7}
          >
            <Text
              className={`text-lg font-bold ${
                activeTab === 'month' ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Breakdown Section */}
        <View className='mx-5 mb-8'>
          <Text className='text-2xl font-bold text-gray-dark mb-4'>Breakdown</Text>

          {/* Hour-based Card */}
          <TouchableOpacity
            className='bg-white rounded-2xl p-5 border border-gray-200 flex-row items-center justify-between mb-4'
            style={{ elevation: 2 }}
            activeOpacity={0.7}
          >
            <View>
              <Text className='text-gray-400 text-sm mb-1'>Hour-based</Text>
              <Text className='text-2xl font-bold text-gray-900'>
                {earningsData.breakdown.hourBased}
              </Text>
            </View>
            <Ionicons name='chevron-forward' size={24} color='#9CA3AF' />
          </TouchableOpacity>

          {/* Total Job Card */}
          <TouchableOpacity
            className='bg-white rounded-2xl p-5 border border-gray-200 flex-row items-center justify-between'
            style={{ elevation: 2 }}
            activeOpacity={0.7}
          >
            <View>
              <Text className='text-gray-400 text-sm mb-1'>Completed</Text>
              <Text className='text-2xl font-bold text-gray-900'>
                {earningsData.breakdown.totalJobs}
              </Text>
            </View>
            <Ionicons name='chevron-forward' size={24} color='#9CA3AF' />
          </TouchableOpacity>
        </View>

        {/* Payment Status Section */}
        <View className='mx-5 mb-12'>
          <Text className='text-2xl font-bold text-gray-dark mb-4'>Payment Status</Text>

          <View className='flex-row gap-4'>
            {/* Pending */}
            <View className='flex-1 bg-white rounded-2xl p-5 border border-gray-200' style={{ elevation: 2 }}>
              <Text className='text-orange-500 font-bold text-lg mb-2'>Pending</Text>
              <Text className='text-2xl font-bold text-gray-900'>
                {earningsData.paymentStatus.pending}
              </Text>
            </View>

            {/* Paid */}
            <View className='flex-1 bg-white rounded-2xl p-5 border border-gray-200' style={{ elevation: 2 }}>
              <Text className='text-green-500 font-bold text-lg mb-2'>Paid</Text>
              <Text className='text-2xl font-bold text-gray-900'>
                {earningsData.paymentStatus.paid}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DriverEarnings