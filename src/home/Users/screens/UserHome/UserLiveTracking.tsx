import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { IPA_BASE } from '@env'
import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Image,
  Linking,
  PanResponder,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../../../constants'
import { AuthStackParamList } from '../../../../Navigation/type'
import {
  DriverLocationData,
  JobStatus,
  JobStatusUpdateData,
  socketService,
} from '../../services/socket.service'

interface Driver {
  id: string
  name: string
  rating: number
  vehicle: string
  plate: string
  phone?: string
  image?: any
}

const STATUS_LABELS: Record<string, string> = {
  BOOKED: 'DRIVER ASSIGNED',
  ON_WAY: 'DRIVER ON THE WAY',
  ARRIVED: 'DRIVER ARRIVED',
  LOADED: 'GOODS LOADED',
  IN_TRANSIT: 'JOB IN PROGRESS',
  DELIVERED: 'JOB DELIVERED',
}

const UserLiveTracking = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const route = useRoute<any>()
  const mapRef = useRef<MapView>(null)
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current

  const { pickup, dropoff, routeData, jobId, bookingId, driver: initialDriver } = route.params || {}
  const activeJobId: string = jobId || bookingId

  const [driver, setDriver] = useState<Driver | null>(initialDriver ?? null)
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [jobStatus, setJobStatus] = useState<JobStatus>('BOOKED')
  const [isCalling, setIsCalling] = useState(false)

  useEffect(() => {
    pan.setOffset({ x: 0, y: 0 })
    socketService.connect()
  }, [])

  useEffect(() => {
    if (!activeJobId) return

    const handleDriverLocation = (data: DriverLocationData) => {
      if (data.jobId !== activeJobId) return
      setDriverLocation({ latitude: data.lat, longitude: data.lng })
    }

    const handleJobStatusUpdate = (data: JobStatusUpdateData) => {
      if (data.jobId !== activeJobId) return
      setJobStatus(data.status)

      switch (data.status) {
        case 'ARRIVED':
          Alert.alert('Driver Arrived', 'Your driver has arrived at the pickup location!')
          break
        case 'IN_TRANSIT':
          Alert.alert('Job Started', 'Goods have been loaded. Heading to destination.')
          break
        case 'DELIVERED':
          Alert.alert('Job Delivered', 'Your goods have been delivered!')
          setTimeout(() => (navigation as any).navigate('UserRateDriver', { jobId: activeJobId }), 2000)
          break
        case 'CANCELLED':
          Alert.alert('Job Cancelled', 'Your job has been cancelled', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ])
          break
      }
    }

    socketService.onDriverLocation(handleDriverLocation)
    socketService.onJobStatusUpdate(handleJobStatusUpdate)

    return () => {
      socketService.offDriverLocation(handleDriverLocation)
      socketService.offJobStatusUpdate(handleJobStatusUpdate)
    }
  }, [activeJobId])

  useEffect(() => {
    if (mapRef.current && pickup && dropoff) {
      const coordinates = [
        { latitude: pickup.latitude, longitude: pickup.longitude },
        { latitude: dropoff.latitude, longitude: dropoff.longitude },
      ]
      if (driverLocation) coordinates.push(driverLocation)
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 80, right: 50, bottom: 300, left: 50 },
        animated: true,
      })
    }
  }, [driverLocation])

  const handleCallDriver = () => {
    if (driver?.phone) {
      setIsCalling(true)
      Linking.openURL(`tel:${driver.phone}`)
        .catch(() => {})
        .finally(() => setIsCalling(false))
    } else {
      Alert.alert('No Phone Number', 'Driver phone number is not available')
    }
  }

  const handleCancelJob = () => {
    Alert.alert('Cancel Job', 'Are you sure you want to cancel this job?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('vToken')
            await axios.delete(`${IPA_BASE}/jobs/${activeJobId}/cancel`, {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 10000,
            })
            navigation.goBack()
          } catch {
            Alert.alert('Error', 'Failed to cancel job')
          }
        },
      },
    ])
  }

  const getProgressPercentage = () => {
    const map: Record<string, number> = {
      BOOKED: 16,
      ON_WAY: 33,
      ARRIVED: 50,
      LOADED: 66,
      IN_TRANSIT: 83,
      DELIVERED: 100,
    }
    return map[jobStatus] ?? 0
  }

  const getStatusText = () => STATUS_LABELS[jobStatus] ?? 'ON THE WAY'

  const routeCoordinates = routeData?.points || [
    { latitude: pickup?.latitude || 48.8566, longitude: pickup?.longitude || 2.3522 },
    { latitude: dropoff?.latitude || 48.855, longitude: dropoff?.longitude || 2.351 },
  ]

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, { dy }) => Math.abs(dy) > 10,
      onPanResponderGrant: () => pan.flattenOffset(),
      onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_evt, { dy, vy }) => {
        if (dy > 100 || vy > 0.5) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 500 },
            useNativeDriver: false,
            speed: 16,
          }).start(() => navigation.goBack())
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start()
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start()
      },
    })
  ).current

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle='dark-content' />

      <View className='flex-1 bg-gray-100'>
        <MapView
          ref={mapRef}
          initialRegion={{
            latitude: pickup?.latitude || 48.8566,
            longitude: pickup?.longitude || 2.3522,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          className='h-full w-full'
          style={{ flex: 1 }}
        >
          {pickup && (
            <Marker coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }} title='Pickup'>
              <View className='h-12 w-12 rounded-full bg-green-500 items-center justify-center shadow-lg border-4 border-white'>
                <MaterialCommunityIcons name='map-marker' size={24} color='white' />
              </View>
            </Marker>
          )}

          {dropoff && (
            <Marker coordinate={{ latitude: dropoff.latitude, longitude: dropoff.longitude }} title='Destination'>
              <View className='h-8 w-8 rounded-full bg-red-500 items-center justify-center border-2 border-white'>
                <MaterialCommunityIcons name='flag-checkered' size={14} color='white' />
              </View>
            </Marker>
          )}

          <Polyline coordinates={routeCoordinates} strokeColor='#FFA500' strokeWidth={4} lineDashPattern={[10, 10]} />

          <Marker
            coordinate={
              driverLocation || {
                latitude: pickup?.latitude || 48.8566,
                longitude: pickup?.longitude || 2.3522,
              }
            }
          >
            <View className='h-10 w-10 rounded-full bg-orange-400 items-center justify-center border-2 border-white'>
              <MaterialCommunityIcons name='truck' size={18} color='white' />
            </View>
          </Marker>
        </MapView>

        <View className='absolute top-0 left-0 right-0 flex-row items-center justify-between px-5 pt-4'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name='chevron-left' size={28} color='#000' />
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-gray-800'>Live Tracking</Text>
          <TouchableOpacity onPress={handleCancelJob}>
            <MaterialCommunityIcons name='close' size={28} color='#EF4444' />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={[{ minHeight: '35%' }, { transform: [{ translateY: pan.y }] }]}
        {...panResponder.panHandlers}
        className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg'
      >
        <View className='items-center py-3'>
          <View className='h-1 w-12 rounded-full bg-gray-300' />
        </View>

        <View className='px-5 pb-6'>
          <View className='flex-row items-center gap-2 mb-4'>
            <View className='h-3 w-3 rounded-full bg-green-500' />
            <Text className='text-sm font-bold text-green-600'>{getStatusText()}</Text>
          </View>

          <View className='mb-6'>
            <View className='flex-row items-center justify-between mb-2'>
              <Text className='text-xs font-semibold text-gray-600'>Driver</Text>
              <Text className='text-xs font-semibold text-gray-600'>Pickup</Text>
              <Text className='text-xs font-semibold text-gray-600'>Dropoff</Text>
            </View>
            <View className='h-2 bg-gray-200 rounded-full overflow-hidden'>
              <View className='h-full bg-green-500 rounded-full' style={{ width: `${getProgressPercentage()}%` }} />
            </View>
          </View>

          <View className='flex-row items-center gap-4 rounded-2xl bg-gray-50 p-4'>
            <Image source={driver?.image || Images.MyProfile} className='h-16 w-16 rounded-full' />

            <View className='flex-1'>
              <View className='flex-row items-center gap-1 mb-1'>
                <Text className='text-base font-bold text-gray-800'>{driver?.name || 'Driver'}</Text>
                <MaterialCommunityIcons name='star' size={14} color='#FFD700' />
                <Text className='text-xs font-semibold text-gray-700'>{driver?.rating || '—'}</Text>
              </View>
              <Text className='text-xs text-gray-600 mb-1'>{driver?.vehicle || 'Vehicle'}</Text>
              <Text className='text-xs font-semibold text-gray-800'>{driver?.plate || '—'}</Text>
            </View>

            <TouchableOpacity
              onPress={handleCallDriver}
              disabled={isCalling}
              className='h-10 w-10 rounded-full bg-green-500 items-center justify-center'
            >
              <MaterialCommunityIcons name='phone' size={18} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}

export default UserLiveTracking
