import { IPA_BASE } from '@env'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type DriverProfile = {
  stripeAccountId: string | null
  stripeOnboardingComplete: boolean
  totalEarnings: number
}

type WithdrawalItem = {
  id: string
  amount: number
  status: string
  createdAt: string
}

const DriverPayout = () => {
  const navigation = useNavigation()
  const [profile, setProfile] = useState<DriverProfile | null>(null)
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [connectingStripe, setConnectingStripe] = useState(false)

  const isStripeConnected = !!profile?.stripeAccountId && !!profile?.stripeOnboardingComplete

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('vToken')
      const [profileRes, withdrawalRes] = await Promise.all([
        axios.get(`${IPA_BASE}/driver/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }),
        axios.get(`${IPA_BASE}/withdrawals/history`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }).catch(() => ({ data: { data: [] } })),
      ])
      setProfile(profileRes.data?.data ?? null)
      setWithdrawals(withdrawalRes.data?.data ?? [])
    } catch (err) {
      console.error('Payout fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh when the screen regains focus (e.g. returning from Stripe onboarding)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData)
    return unsubscribe
  }, [navigation])

  const handleConnectStripe = async () => {
    try {
      setConnectingStripe(true)
      const token = await AsyncStorage.getItem('vToken')

      let res
      if (isStripeConnected) {
        // Already onboarded — open Stripe Express dashboard
        res = await axios.post(`${IPA_BASE}/driver/stripe/login-link`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        })
      } else {
        // Not yet onboarded — start / resume onboarding
        res = await axios.post(
          `${IPA_BASE}/driver/stripe/onboarding-link`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          },
        )
      }

      const url: string = res.data?.data?.url ?? res.data?.data?.onboardingUrl ?? ''
      if (url) {
        await Linking.openURL(url)
      } else {
        Alert.alert('Error', 'Could not get Stripe link.')
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to open Stripe.')
    } finally {
      setConnectingStripe(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center' edges={['top']}>
        <ActivityIndicator color='#43B047' size='large' />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1' edges={['top']}>
      <StatusBar style='dark' />
      <View className='px-4 py-4'>
        <View className='flex-row items-center'>
          <TouchableOpacity onPress={() => navigation.goBack()} className='p-2'>
            <Text className='text-3xl'>←</Text>
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-gray-900 ml-2'>Payout & Stripe</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        {/* Stripe Status Card */}
        <View className='mx-5 mt-6 mb-6'>
          <View className='bg-white rounded-3xl p-5 border border-gray-200' style={{ elevation: 2 }}>
            <View className='flex-row items-center mb-3'>
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isStripeConnected ? 'bg-green-500' : 'bg-orange-400'}`}>
                <Ionicons name={isStripeConnected ? 'checkmark' : 'warning-outline'} size={20} color='white' />
              </View>
              <View className='flex-1'>
                <Text className='text-xl font-bold text-gray-900'>
                  {isStripeConnected ? 'Stripe: Connected' : 'Stripe: Not Connected'}
                </Text>
              </View>
              <Text className={`font-bold text-base ${isStripeConnected ? 'text-green-500' : 'text-orange-400'}`}>
                {isStripeConnected ? 'Active' : 'Pending'}
              </Text>
            </View>
            <Text className='text-gray-400 text-sm leading-5'>
              {isStripeConnected
                ? 'Your account is linked and ready to receive automatic payouts.'
                : 'Connect your Stripe account to receive payouts from completed jobs.'}
            </Text>
          </View>
        </View>

        {/* Earnings Info */}
        <View className='mx-5 flex-row gap-3 mb-8'>
          <View className='flex-1 bg-white rounded-2xl p-5 border border-gray-200' style={{ elevation: 2 }}>
            <Text className='text-gray-400 text-sm mb-2'>Total Earnings</Text>
            <Text className='text-xl font-bold text-gray-900'>
              ${(profile?.totalEarnings ?? 0).toFixed(2)}
            </Text>
          </View>
          <View className='flex-1 bg-white rounded-2xl p-5 border border-gray-200' style={{ elevation: 2 }}>
            <Text className='text-green-500 font-bold text-sm mb-2'>Withdrawals</Text>
            <Text className='text-xl font-bold text-gray-900'>{withdrawals.length}</Text>
          </View>
        </View>

        {/* Recent Withdrawals */}
        {withdrawals.length > 0 && (
          <>
            <View className='mx-5 flex-row items-center justify-between mb-4'>
              <Text className='text-2xl font-bold text-gray-900'>Recent Withdrawals</Text>
            </View>
            <View className='mx-5 mb-8'>
              {withdrawals.slice(0, 5).map((w) => (
                <View
                  key={w.id}
                  className='bg-white rounded-2xl p-5 border border-gray-200 mb-3 flex-row items-center justify-between'
                  style={{ elevation: 2 }}
                >
                  <View className='flex-1'>
                    <Text className='text-lg font-bold text-gray-900 mb-1 capitalize'>{w.status}</Text>
                    <Text className='text-sm text-gray-400'>
                      {new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                  <Text className='text-xl font-bold text-gray-900'>${w.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Connect / Manage Stripe Button */}
        <View className='mx-5 mb-4'>
          <TouchableOpacity
            onPress={handleConnectStripe}
            disabled={connectingStripe}
            className='bg-green-500 rounded-2xl py-5 flex-row items-center justify-center'
            style={{ elevation: 4, opacity: connectingStripe ? 0.7 : 1 }}
            activeOpacity={0.8}
          >
            {connectingStripe ? (
              <ActivityIndicator color='white' />
            ) : (
              <>
                <FontAwesome name='credit-card' size={24} color='white' />
                <Text className='text-white font-bold text-lg ml-3'>
                  {isStripeConnected ? 'Manage Stripe Account' : 'Connect Stripe Account'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className='mx-5 pb-8 flex-row items-center'>
          <Ionicons name='lock-closed' size={20} color='#9CA3AF' />
          <Text className='text-gray-400 text-sm ml-2'>Payments are secured by Stripe</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DriverPayout
