// UserFindingDrivers.tsx - With Socket.IO integration
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Image,
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
import { RideAcceptData, RideCancelData, socketService } from '../../services/socket.service'

const { height } = Dimensions.get('window')

type SearchStatus = 'searching' | 'driver_assigned' | 'cancelled' | 'error'

const UserFindingDrivers = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const route = useRoute<any>()
  const mapRef = useRef<MapView>(null)
  const pan = useRef(new Animated.ValueXY()).current
  const scaleAnim = useRef(new Animated.Value(1)).current

  const {
    pickup,
    dropoff,
    routeData,
    selectedTruck,
    scheduleDate,
    scheduleTime,
    workNotes,
    costBreakdown,
    bookingId
  } = route.params || {}

  const [searchStatus, setSearchStatus] = useState<SearchStatus>('searching')
  const [searchMessage, setSearchMessage] = useState('Finding nearby drivers...')
  const [assignedDriver, setAssignedDriver] = useState<RideAcceptData | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  // Pulsing animation for searching
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [scaleAnim])

  // Connect socket and listen for ride events
  useEffect(() => {
    if (!bookingId) {
      console.error('No booking ID provided')
      setSearchStatus('error')
      setErrorMessage('Invalid booking information')
      return
    }

    const setupSocket = async () => {
      try {
        // Connect to socket
        await socketService.connect()

        // Join the booking room
        socketService.joinBookingRoom(bookingId)

        // Listen for ride acceptance
        socketService.onRideAccepted(handleRideAccepted)

        // Listen for ride cancellation
        socketService.onRideCancelled(handleRideCancelled)

        // Listen for status updates
        socketService.onRideStatusUpdate(handleRideStatusUpdate)

        // Set timeout for no driver found (optional, based on your business logic)
        const timeoutTimer = setTimeout(() => {
          if (searchStatus === 'searching') {
            setSearchStatus('error')
            setErrorMessage('No drivers available at the moment. Please try again.')
          }
        }, 60000) // 60 seconds timeout

        return () => clearTimeout(timeoutTimer)
      } catch (error) {
        console.error('Error setting up socket:', error)
        setSearchStatus('error')
        setErrorMessage('Failed to connect to driver service')
      }
    }

    setupSocket()

    // Cleanup on unmount
    return () => {
      if (bookingId) {
        socketService.leaveBookingRoom(bookingId)
      }
      // Don't disconnect globally as other screens might need it
    }
  }, [bookingId])

  const handleRideAccepted = (data: RideAcceptData) => {
    console.log('Ride accepted by driver:', data)

    if (data.bookingId !== bookingId) return

    setAssignedDriver(data)
    setSearchStatus('driver_assigned')
    setSearchMessage(`Driver ${data.driverName} has accepted your ride!`)

    // Navigate to tracking screen after a short delay
    setTimeout(() => {
      (navigation as any).navigate("UserLiveTracking", {
        pickup,
        dropoff,
        routeData,
        selectedTruck,
        scheduleDate,
        scheduleTime,
        workNotes,
        costBreakdown,
        bookingId,
        driver: {
          id: data.driverId,
          name: data.driverName,
          rating: data.driverRating,
          vehicle: data.vehicleType,
          plate: data.vehicleNumber,
          eta: data.eta,
          phone: data.driverPhone,
          image: data.driverImage
        }
      })
    }, 2000)
  }

  const handleRideCancelled = (data: RideCancelData) => {
    console.log('Ride cancelled:', data)

    if (data.bookingId !== bookingId) return

    setSearchStatus('cancelled')
    setErrorMessage(data.reason || 'Your ride request was cancelled')

    Alert.alert(
      'Ride Cancelled',
      data.reason || 'Your ride request was cancelled by the driver',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    )
  }

  const handleRideStatusUpdate = (data: { bookingId: string; status: string; message?: string }) => {
    if (data.bookingId !== bookingId) return

    console.log('Ride status update:', data)

    switch (data.status) {
      case 'searching':
        setSearchMessage(data.message || 'Searching for nearby drivers...')
        break
      case 'driver_assigned':
        setSearchMessage(data.message || 'Driver assigned! Redirecting...')
        break
      case 'driver_arrived':
        // Can update UI if needed
        break
      case 'ride_started':
        // Can update UI if needed
        break
      case 'ride_completed':
        // Can update UI if needed
        break
      case 'cancelled':
        handleRideCancelled({ bookingId: data.bookingId, reason: data.message || 'Ride cancelled', cancelledBy: 'system' })
        break
    }
  }

  const handleCancelSearch = async () => {
    Alert.alert(
      'Cancel Search',
      'Are you sure you want to cancel your ride request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            setIsCancelling(true)
            try {
              await socketService.cancelRideSearch(bookingId)
              setSearchStatus('cancelled')
              Alert.alert('Cancelled', 'Your ride request has been cancelled', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ])
            } catch (error) {
              console.error('Error cancelling ride:', error)
              Alert.alert('Error', 'Failed to cancel ride request')
            } finally {
              setIsCancelling(false)
            }
          }
        }
      ]
    )
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, { dy }) => Math.abs(dy) > 10,
      onPanResponderRelease: (evt, { dy }) => {
        if (dy > 100) {
          if (searchStatus === 'searching') {
            handleCancelSearch()
          } else {
            navigation.goBack()
          }
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start()
        }
      },
    })
  ).current

  const routeCoordinates = routeData?.points || [
    { latitude: pickup?.latitude || 23.8103, longitude: pickup?.longitude || 90.4125 },
    { latitude: dropoff?.latitude || 23.7806, longitude: dropoff?.longitude || 90.4 }
  ]

  // Render content based on search status
  const renderContent = () => {
    if (searchStatus === 'error') {
      return (
        <View className='flex-1 items-center justify-center px-6'>
          <View className='h-20 w-20 rounded-full bg-red-100 items-center justify-center mb-6'>
            <MaterialCommunityIcons name='alert-circle' size={48} color='#EF4444' />
          </View>
          <Text className='text-2xl font-bold text-red-500 mb-3 text-center'>
            Search Failed
          </Text>
          <Text className='text-base text-gray-600 text-center mb-6'>
            {errorMessage || 'Unable to find drivers. Please try again.'}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='bg-green-500 rounded-xl px-6 py-3'
          >
            <Text className='text-white font-semibold'>Go Back</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (searchStatus === 'cancelled') {
      return (
        <View className='flex-1 items-center justify-center px-6'>
          <View className='h-20 w-20 rounded-full bg-yellow-100 items-center justify-center mb-6'>
            <MaterialCommunityIcons name='close-circle' size={48} color='#F59E0B' />
          </View>
          <Text className='text-2xl font-bold text-yellow-500 mb-3 text-center'>
            Search Cancelled
          </Text>
          <Text className='text-base text-gray-600 text-center mb-6'>
            Your ride request has been cancelled
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='bg-green-500 rounded-xl px-6 py-3'
          >
            <Text className='text-white font-semibold'>Go Back</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <>
        <Animated.View
          style={[{ transform: [{ scale: scaleAnim }] }]}
          className='mb-6 h-24 w-24 rounded-full bg-green-50 items-center justify-center'
        >
          <View className='h-20 w-20 rounded-full bg-green-100 items-center justify-center'>
            <Image source={Images.FindTruck} className='h-16 w-16' resizeMode='contain' />
          </View>
        </Animated.View>

        <Text className='text-2xl font-bold text-green-500 mb-3 text-center'>
          {searchStatus === 'driver_assigned' ? 'Driver Found!' : 'Finding nearby drivers...'}
        </Text>

        <Text className='text-base text-gray-600 text-center'>
          {searchMessage}
        </Text>

        {searchStatus === 'searching' && (
          <>
            <View className='mt-6 flex-row items-center gap-1'>
              <View className='h-2 w-2 rounded-full bg-green-500' />
              <View className='h-2 w-2 rounded-full bg-green-500' />
              <View className='h-2 w-2 rounded-full bg-green-500' />
            </View>

            <TouchableOpacity
              onPress={handleCancelSearch}
              disabled={isCancelling}
              className='mt-8 rounded-xl px-6 py-3 border border-red-500'
            >
              <Text className='text-red-500 font-semibold'>
                {isCancelling ? 'Cancelling...' : 'Cancel Search'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {searchStatus === 'driver_assigned' && (
          <View className='mt-6 bg-green-50 rounded-xl px-4 py-2'>
            <Text className='text-green-600 font-semibold'>Redirecting to tracking...</Text>
          </View>
        )}
      </>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle='dark-content' />

      {/* Map */}
      <View className='flex-1 bg-gray-100'>
        <MapView
          ref={mapRef}
          className='h-full w-full'
          style={{ flex: 1 }}
          initialRegion={{
            latitude: pickup?.latitude || 23.8103,
            longitude: pickup?.longitude || 90.4125,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Pickup Marker */}
          {pickup && (
            <Marker coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}>
              <View className='h-10 w-10 rounded-full bg-green-500 items-center justify-center border-2 border-white'>
                <MaterialCommunityIcons name='circle' size={16} color='white' />
              </View>
            </Marker>
          )}

          {/* Dropoff Marker */}
          {dropoff && (
            <Marker coordinate={{ latitude: dropoff.latitude, longitude: dropoff.longitude }}>
              <View className='h-8 w-8 rounded-full bg-red-500 items-center justify-center border-2 border-white'>
                <MaterialCommunityIcons name='flag' size={14} color='white' />
              </View>
            </Marker>
          )}

          {/* Route Line */}
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#4CAF50"
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
          )}

          {/* Animated Driver Markers (searching) */}
          {searchStatus === 'searching' && (
            <>
              <Marker coordinate={{ latitude: (pickup?.latitude || 23.8103) + 0.005, longitude: (pickup?.longitude || 90.4125) - 0.008 }}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <View className='h-8 w-8 rounded-full bg-orange-400 items-center justify-center'>
                    <MaterialCommunityIcons name='truck' size={14} color='white' />
                  </View>
                </Animated.View>
              </Marker>
              <Marker coordinate={{ latitude: (pickup?.latitude || 23.8103) - 0.007, longitude: (pickup?.longitude || 90.4125) + 0.01 }}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <View className='h-8 w-8 rounded-full bg-orange-400 items-center justify-center'>
                    <MaterialCommunityIcons name='truck' size={14} color='white' />
                  </View>
                </Animated.View>
              </Marker>
            </>
          )}
        </MapView>

        {/* Header */}
        <View className='absolute top-0 left-0 right-0 flex-row items-center justify-between px-5 pt-4'>
          <TouchableOpacity onPress={() => {
            if (searchStatus === 'searching') {
              handleCancelSearch()
            } else {
              navigation.goBack()
            }
          }}>
            <Entypo name='chevron-left' size={28} color='#000' />
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-gray-800'>Finding Drivers</Text>
          <View className='w-7' />
        </View>
      </View>

      {/* Bottom Modal */}
      <Animated.View
        style={[
          { height: height * 0.45 },
          { transform: [{ translateY: pan.y }] },
        ]}
        {...panResponder.panHandlers}
        className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg'
      >
        <View className='items-center py-3'>
          <View className='h-1 w-12 rounded-full bg-gray-300' />
        </View>

        <View className='flex-1 items-center justify-center px-6 pb-6'>
          {renderContent()}
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}

export default UserFindingDrivers