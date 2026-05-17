import { IPA_BASE } from '@env'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../../Navigation/type'

const ACTIVE_STATUSES = new Set(['BOOKED', 'ON_WAY', 'ARRIVED', 'LOADED', 'IN_TRANSIT'])

const STATUS_LABELS: Record<string, string> = {
  BOOKED: 'Driver Assigned',
  ON_WAY: 'On the Way',
  ARRIVED: 'Arrived at Pickup',
  LOADED: 'Goods Loaded',
  IN_TRANSIT: 'In Transit',
}

type ActiveJob = {
  id: string
  status: string
  pickupAddress: string
  dropoffAddress: string
  distanceKm: number | null
  estimatedFare: number | null
  truckType: { name: string } | null
  driver: { numberPlate: string | null; truckModel: string | null } | null
}

const DriverTruck = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const [job, setJob] = useState<ActiveJob | null>(null)
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      let cancelled = false
      const load = async () => {
        try {
          const token = await AsyncStorage.getItem('vToken')
          const res = await axios.get(`${IPA_BASE}/jobs/driver-jobs`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          })
          const jobs: ActiveJob[] = res.data?.data ?? []
          const active = jobs.find((j) => ACTIVE_STATUSES.has(j.status)) ?? null
          if (cancelled) return
          if (active) {
            navigation.navigate('HeadingToPickup', { jobId: active.id })
            return
          }
          setJob(null)
        } catch (err) {
          console.error('DriverTruck load error:', err)
        } finally {
          if (!cancelled) setLoading(false)
        }
      }
      load()
      return () => { cancelled = true }
    }, [])
  )

  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-white items-center justify-center' edges={['top']}>
        <ActivityIndicator color='#43B047' size='large' />
      </SafeAreaView>
    )
  }

  if (!job) {
    return (
      <SafeAreaView className='flex-1 bg-white' edges={['top']}>
        <StatusBar barStyle='dark-content' />
        <View className='flex-1 items-center justify-center px-8'>
          <View className='w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-6'>
            <MaterialIcons name='local-shipping' size={48} color='#9CA3AF' />
          </View>
          <Text className='text-xl font-bold text-gray-800 text-center mb-2'>No Active Job</Text>
          <Text className='text-base text-gray-400 text-center'>
            You don't have any active jobs right now. New jobs will appear on your Home tab.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const statusLabel = STATUS_LABELS[job.status] ?? job.status

  return (
    <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
      <StatusBar barStyle='dark-content' />

      {/* Header */}
      <View className='bg-white px-5 py-4 border-b border-gray-100'>
        <Text className='text-2xl font-bold text-gray-900'>Active Job</Text>
        <View className='flex-row items-center mt-1'>
          <View className='w-2.5 h-2.5 rounded-full bg-green-500 mr-2' />
          <Text className='text-sm font-semibold text-green-600'>{statusLabel}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 px-5 pt-5'>
        {/* Job ID */}
        <View className='bg-white rounded-2xl p-5 mb-4 border border-gray-100' style={{ elevation: 2 }}>
          <Text className='text-xs font-bold text-gray-400 mb-1'>JOB ID</Text>
          <Text className='text-base font-bold text-gray-800'>#{job.id.slice(-8).toUpperCase()}</Text>
        </View>

        {/* Route */}
        <View className='bg-white rounded-2xl p-5 mb-4 border border-gray-100' style={{ elevation: 2 }}>
          <Text className='text-xs font-bold text-gray-400 mb-3'>ROUTE</Text>
          <View className='flex-row items-start mb-3'>
            <View className='w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-3 mt-0.5'>
              <MaterialIcons name='my-location' size={16} color='#22C55E' />
            </View>
            <View className='flex-1'>
              <Text className='text-xs text-gray-400 font-semibold mb-0.5'>PICKUP</Text>
              <Text className='text-base text-gray-800 font-medium'>{job.pickupAddress}</Text>
            </View>
          </View>
          <View className='w-0.5 h-4 bg-gray-200 ml-4 mb-3' />
          <View className='flex-row items-start'>
            <View className='w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3 mt-0.5'>
              <MaterialIcons name='location-on' size={16} color='#EF4444' />
            </View>
            <View className='flex-1'>
              <Text className='text-xs text-gray-400 font-semibold mb-0.5'>DROPOFF</Text>
              <Text className='text-base text-gray-800 font-medium'>{job.dropoffAddress}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className='flex-row gap-3 mb-4'>
          <View className='flex-1 bg-white rounded-2xl p-4 border border-gray-100 items-center' style={{ elevation: 2 }}>
            <Text className='text-xs text-gray-400 font-bold mb-1'>DISTANCE</Text>
            <Text className='text-xl font-bold text-gray-900'>
              {job.distanceKm ? `${job.distanceKm.toFixed(1)} km` : '—'}
            </Text>
          </View>
          <View className='flex-1 bg-white rounded-2xl p-4 border border-gray-100 items-center' style={{ elevation: 2 }}>
            <Text className='text-xs text-gray-400 font-bold mb-1'>FARE</Text>
            <Text className='text-xl font-bold text-gray-900'>
              {job.estimatedFare ? `$${job.estimatedFare.toFixed(0)}` : '—'}
            </Text>
          </View>
        </View>

        {/* Vehicle */}
        {(job.driver?.truckModel || job.driver?.numberPlate || job.truckType) && (
          <View className='bg-white rounded-2xl p-5 mb-6 border border-gray-100' style={{ elevation: 2 }}>
            <Text className='text-xs font-bold text-gray-400 mb-3'>VEHICLE</Text>
            <View className='flex-row gap-3'>
              {job.truckType && (
                <View className='flex-1'>
                  <Text className='text-xs text-gray-400 mb-0.5'>TYPE</Text>
                  <Text className='text-sm font-bold text-gray-900'>{job.truckType.name}</Text>
                </View>
              )}
              {job.driver?.numberPlate && (
                <View className='flex-1'>
                  <Text className='text-xs text-gray-400 mb-0.5'>PLATE</Text>
                  <Text className='text-sm font-bold text-gray-900'>{job.driver.numberPlate}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View className='h-28' />
      </ScrollView>

      {/* CTA Button */}
      <View className='absolute bottom-0 left-0 right-0 px-5 pb-8 bg-gray-50'>
        <TouchableOpacity
          onPress={() => navigation.navigate('HeadingToPickup', { jobId: job.id })}
          className='bg-green-500 rounded-2xl py-5 flex-row items-center justify-center'
          style={{ elevation: 4 }}
          activeOpacity={0.85}
        >
          <Ionicons name='navigate' size={22} color='white' />
          <Text className='text-white font-bold text-lg ml-2'>CONTINUE JOB</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default DriverTruck
