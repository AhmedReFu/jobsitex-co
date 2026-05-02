import { CANCEL_JOBS, IPA_BASE, JOB_DETAILS, START_JOBS } from '@env'
import { Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import * as Location from 'expo-location'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Linking,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Toast, useToast } from '../../../../Components/useToost'
import { AuthStackParamList } from '../../../../Navigation/type'
import { useRouteDirection } from '../../../../Utils/useRouteDirection'

const API_BASE_URL = IPA_BASE
const END_POINTS = { JOB_DETAILS, CANCEL_JOBS, START_JOBS }
const { height: SCREEN_HEIGHT } = Dimensions.get('window')

type JobApiResponse = {
    _id: string
    jobId: string
    vehicleType: string
    status: string
    distance: number
    duration: number
    fare: number
    scheduleDate?: string
    scheduleTime?: string
    workNotes?: string
    pickupLocation: {
        type: string
        coordinates: [number, number]
        address: string
    }
    dropLocation: {
        type: string
        coordinates: [number, number]
        address: string
    }
    userId: {
        fullName: string
        email: string
        phoneNumber: string
    }
    driverId?: {
        vehicleType: string
        vehicleCapacity: string
        hourRate: number
    }
}

const coordsFromApi = (coords: [number, number]) => ({
    latitude: coords[1],
    longitude: coords[0],
})

// Skeleton Card Component
const SkeletonCard = () => {
    const shimmer = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
            ])
        ).start()
    }, [shimmer])

    const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.9] })

    const Box = ({ w, h, mb = 0, br = 8 }: { w: string | number; h: number; mb?: number; br?: number }) => (
        <Animated.View style={{ width: w as any, height: h, marginBottom: mb, borderRadius: br, backgroundColor: '#E5E7EB', opacity }} />
    )

    return (
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 14, elevation: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Box w={80} h={14} br={6} />
                <Box w={60} h={14} br={6} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                <Box w='48%' h={48} br={10} />
                <Box w='48%' h={48} br={10} />
            </View>
            <Box w='30%' h={10} mb={6} br={4} />
            <Box w='90%' h={14} mb={14} br={6} />
            <Box w='30%' h={10} mb={6} br={4} />
            <Box w='75%' h={14} mb={14} br={6} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
                <Box w={60} h={32} br={8} />
                <Box w={60} h={32} br={8} />
                <Box w={60} h={32} br={8} />
            </View>
            <Box w='100%' h={46} br={12} />
        </View>
    )
}

const JobAssigned = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const route = useRoute<any>()
    const toast = useToast()
    const mapRef = useRef<MapView>(null)
    const locationWatcherRef = useRef<Location.LocationSubscription | null>(null)
    const isFirstLoadRef = useRef(true)
    const isUpdatingRoutesRef = useRef(false)

    const jobId: string = route.params?.jobId ?? ''

    const [data, setData] = useState<JobApiResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null)
    const [isStartingJob, setIsStartingJob] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)

    const { routeData: routeToPickup, getRoute: getRouteToPickup, isLoading: loadingPickupRoute } = useRouteDirection()
    const { routeData: routeToDropoff, getRoute: getRouteToDropoff, isLoading: loadingDropoffRoute } = useRouteDirection()

    const getCurrentLocation = useCallback(async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') return null

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            })

            console.log('📍 Current location:', location.coords.latitude, location.coords.longitude)

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
        } catch (error) {
            console.error('Error getting location:', error)
            return null
        }
    }, [])

    const updateRoutes = useCallback(async (current: { latitude: number; longitude: number }, jobData: JobApiResponse | null = null) => {
        if (isUpdatingRoutesRef.current) {
            console.log('⏳ Route update already in progress, skipping...')
            return
        }

        const useData = jobData || data

        if (!useData?.pickupLocation?.coordinates) {
            console.log('❌ No pickup coordinates')
            return
        }

        isUpdatingRoutesRef.current = true

        try {
            const pickup = coordsFromApi(useData.pickupLocation.coordinates)
            const dropoff = useData.dropLocation?.coordinates ? coordsFromApi(useData.dropLocation.coordinates) : null

            console.log('📍 Current:', current.latitude, current.longitude)
            console.log('📍 Pickup:', pickup.latitude, pickup.longitude)
            if (dropoff) console.log('📍 Dropoff:', dropoff.latitude, dropoff.longitude)

            await getRouteToPickup(
                {
                    id: 'current',
                    title: 'Current Location',
                    address: 'Your Location',
                    latitude: current.latitude,
                    longitude: current.longitude
                },
                {
                    id: 'pickup',
                    title: 'Pickup',
                    address: useData.pickupLocation.address,
                    latitude: pickup.latitude,
                    longitude: pickup.longitude
                }
            )
            console.log('✅ Route to pickup completed. Points:', routeToPickup?.points?.length || 0)

            if (dropoff) {
                await getRouteToDropoff(
                    {
                        id: 'pickup',
                        title: 'Pickup',
                        address: useData.pickupLocation.address,
                        latitude: pickup.latitude,
                        longitude: pickup.longitude
                    },
                    {
                        id: 'dropoff',
                        title: 'Dropoff',
                        address: useData.dropLocation.address,
                        latitude: dropoff.latitude,
                        longitude: dropoff.longitude
                    }
                )
                console.log('✅ Route to dropoff completed. Points:', routeToDropoff?.points?.length || 0)
            }
        } catch (error) {
            console.error('Error updating routes:', error)
        } finally {
            isUpdatingRoutesRef.current = false
        }
    }, [data, getRouteToPickup, getRouteToDropoff, routeToPickup?.points?.length, routeToDropoff?.points?.length])

    const startWatchingLocation = useCallback(async () => {
        if (locationWatcherRef.current) {
            locationWatcherRef.current.remove()
        }

        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') return

        locationWatcherRef.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 10000,
                distanceInterval: 50,
            },
            async (location) => {
                const newCoords = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }

                const hasChanged = !currentCoords ||
                    Math.abs(currentCoords.latitude - newCoords.latitude) > 0.0001 ||
                    Math.abs(currentCoords.longitude - newCoords.longitude) > 0.0001

                if (hasChanged) {
                    console.log('📍 Location changed, updating routes...')
                    setCurrentCoords(newCoords)
                    await updateRoutes(newCoords)
                }
            }
        )
    }, [updateRoutes, currentCoords])

    const fetchJobDetails = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            const token = await AsyncStorage.getItem('vToken')
            if (!token) {
                toast.show({
                    message: 'Authentication failed. Please login again.',
                    type: 'error',
                    style: 'top',
                })
                return
            }

            const res = await axios.get(`${API_BASE_URL}${END_POINTS.JOB_DETAILS}${jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000,
            })

            const job: JobApiResponse = res.data?.data
            console.log('✅ Job fetched:', job.jobId)

            setData(job)

            const currentLoc = await getCurrentLocation()

            if (currentLoc) {
                setCurrentCoords(currentLoc)
                await updateRoutes(currentLoc, job)
            }

            await startWatchingLocation()

            setTimeout(() => {
                if (mapRef.current && job?.pickupLocation?.coordinates) {
                    const pickup = coordsFromApi(job.pickupLocation.coordinates)
                    const dropoff = job.dropLocation?.coordinates ? coordsFromApi(job.dropLocation.coordinates) : null

                    const focusCoords = [pickup]
                    if (dropoff) focusCoords.push(dropoff)

                    if (focusCoords.length > 0) {
                        mapRef.current.fitToCoordinates(focusCoords, {
                            edgePadding: { top: 80, right: 60, bottom: 60, left: 60 },
                            animated: true,
                        })
                    }
                }
            }, 1000)

        } catch (err: any) {
            console.error('Error:', err?.response?.data || err?.message)
            setError('Could not load job details.')
            toast.show({
                message: err?.response?.data?.message || 'Failed to load job details',
                type: 'error',
                style: 'top',
            })
        } finally {
            setIsLoading(false)
        }
    }, [jobId, getCurrentLocation, updateRoutes, startWatchingLocation, toast])

    useEffect(() => {
        if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false
            fetchJobDetails()
        }

        return () => {
            if (locationWatcherRef.current) {
                locationWatcherRef.current.remove()
                locationWatcherRef.current = null
            }
        }
    }, [fetchJobDetails])

    // ✅ Start Job Handler
    const handleStartJob = async () => {
        try {
            setIsStartingJob(true)

            const token = await AsyncStorage.getItem('vToken')
            if (!token) {
                toast.show({
                    message: 'Authentication failed. Please login again.',
                    type: 'error',
                    style: 'top',
                })
                return
            }
            const response = await axios.patch(
                `${API_BASE_URL}/jobs/${jobId}/status`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000,
                }
            );
            console.log(response)
            if (response.data?.success === true) {
                toast.show({
                    message: 'Job started successfully!',
                    type: 'success',
                    style: 'top',
                })

                // Navigate to pickup screen
                navigation.navigate('HeadingToPickup', { jobId })
            } else {
                toast.show({
                    message: response.data?.message || 'Failed to start job',
                    type: 'error',
                    style: 'top',
                })
            }
        } catch (err: any) {
            console.error('Start job error:', err)
            toast.show({
                message: err?.response?.data?.message || 'Something went wrong',
                type: 'error',
                style: 'top',
            })
        } finally {
            setIsStartingJob(false)
        }
    }

    // ✅ Cancel Job Handler
    const handleCancel = async () => {
        // Show confirmation first
        toast.show({
            message: 'Are you sure you want to cancel this job?',
            type: 'warning',
            style: 'center',
            duration: null,
            buttons: [
                {
                    text: 'Yes, Cancel',
                    action: 'custom',
                    onPress: async () => {
                        try {
                            setIsCancelling(true)

                            const token = await AsyncStorage.getItem('vToken')
                            if (!token) {
                                toast.show({
                                    message: 'Authentication failed. Please login again.',
                                    type: 'error',
                                    style: 'top',
                                })
                                return
                            }

                            const response = await axios.delete(
                                `${API_BASE_URL}/jobs/${jobId}/cancel`,
                                {
                                    headers: { Authorization: `Bearer ${token}` },
                                    timeout: 15000,
                                }
                            )

                            if (response.data?.success === true) {
                                toast.show({
                                    message: 'Job cancelled successfully',
                                    type: 'success',
                                    style: 'top',
                                })

                                // Go back after cancel
                                setTimeout(() => {
                                    navigation.goBack()
                                }, 1000)
                            } else {
                                toast.show({
                                    message: response.data?.message || 'Failed to cancel job',
                                    type: 'error',
                                    style: 'top',
                                })
                            }
                        } catch (err: any) {
                            console.error('Cancel job error:', err)
                            toast.show({
                                message: err?.response?.data?.message || 'Something went wrong',
                                type: 'error',
                                style: 'top',
                            })
                        } finally {
                            setIsCancelling(false)
                        }
                    }
                },
                {
                    text: 'No',
                    action: 'dismiss'
                }
            ]
        })
    }

    const handleCurrentLocationPress = () => {
        if (currentCoords && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000)
        }
    }

    const handlePickupPress = () => {
        if (pickupCoords && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: pickupCoords.latitude,
                longitude: pickupCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000)
        }
    }

    const handleDropoffPress = () => {
        if (dropCoords && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: dropCoords.latitude,
                longitude: dropCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000)
        }
    }

    const handleShowAllPress = () => {
        if (mapRef.current && pickupCoords && dropCoords) {
            mapRef.current.fitToCoordinates([pickupCoords, dropCoords], {
                edgePadding: { top: 80, right: 60, bottom: 60, left: 60 },
                animated: true,
            })
        }
    }

    const pickupCoords = data?.pickupLocation?.coordinates ? coordsFromApi(data.pickupLocation.coordinates) : null
    const dropCoords = data?.dropLocation?.coordinates ? coordsFromApi(data.dropLocation.coordinates) : null
    const isRouteLoading = loadingPickupRoute || loadingDropoffRoute

    // Skeleton Loading UI
    if (isLoading) {
        return (
            <SafeAreaView className='flex-1 bg-white' edges={['top']}>
                <StatusBar barStyle='dark-content' />
                <View className='flex-1 px-5 pt-4'>
                    <View style={{ height: SCREEN_HEIGHT * 0.45, backgroundColor: '#E5E7EB', borderRadius: 20, marginBottom: 16 }} />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </View>
            </SafeAreaView>
        )
    }

    if (error || !data) {
        return (
            <SafeAreaView className='flex-1 bg-white items-center justify-center px-6'>
                <MaterialCommunityIcons name='alert-circle-outline' size={48} color='#EF4444' />
                <Text className='text-gray-900 font-bold text-xl mt-4 text-center'>
                    Failed to load job
                </Text>
                <Text className='text-gray-500 text-center mt-2'>{error}</Text>
                <TouchableOpacity
                    onPress={() => {
                        isFirstLoadRef.current = true
                        fetchJobDetails()
                    }}
                    className='bg-green-500 rounded-2xl px-8 py-4 mt-6'
                >
                    <Text className='text-white font-bold text-base'>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-white' edges={['top']}>
            <StatusBar barStyle='dark-content' />

            <View className='flex-1'>
                {/* Map View */}
                <View style={{ height: SCREEN_HEIGHT * 0.45 }}>
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={{ flex: 1 }}
                        showsUserLocation
                        showsMyLocationButton={false}
                        initialRegion={{
                            latitude: pickupCoords?.latitude || 23.8103,
                            longitude: pickupCoords?.longitude || 90.4125,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                    >
                        {currentCoords && (
                            <Marker coordinate={currentCoords} title='Your Location'>
                                <View className='w-8 h-8 rounded-full bg-blue-500 items-center justify-center border-2 border-white'>
                                    <Ionicons name='navigate' size={16} color='white' />
                                </View>
                            </Marker>
                        )}

                        {pickupCoords && (
                            <Marker coordinate={pickupCoords} title='Pickup'>
                                <View className='w-8 h-8 rounded-full bg-orange-500 items-center justify-center border-2 border-white'>
                                    <MaterialIcons name='location-on' size={16} color='white' />
                                </View>
                            </Marker>
                        )}

                        {dropCoords && (
                            <Marker coordinate={dropCoords} title='Drop-off'>
                                <View className='w-8 h-8 rounded-full bg-green-500 items-center justify-center border-2 border-white'>
                                    <MaterialCommunityIcons name='flag-checkered' size={14} color='white' />
                                </View>
                            </Marker>
                        )}

                        {routeToPickup?.points && routeToPickup.points.length > 0 && (
                            <Polyline
                                coordinates={routeToPickup.points}
                                strokeColor='#3B82F6'
                                strokeWidth={6}
                            />
                        )}

                        {routeToDropoff?.points && routeToDropoff.points.length > 0 && (
                            <Polyline
                                coordinates={routeToDropoff.points}
                                strokeColor='#10B981'
                                strokeWidth={6}
                            />
                        )}
                    </MapView>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className='absolute top-4 left-4 bg-white rounded-full p-2'
                        style={{ elevation: 4 }}
                    >
                        <Entypo name='chevron-left' size={24} color='#111827' />
                    </TouchableOpacity>

                    <View className='absolute bottom-4 right-4 gap-2'>
                        <TouchableOpacity onPress={handleShowAllPress} className='bg-white rounded-full p-3' style={{ elevation: 4 }}>
                            <MaterialCommunityIcons name='map-marker-radius' size={22} color='#4CAF50' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePickupPress} className='bg-white rounded-full p-3' style={{ elevation: 4 }}>
                            <MaterialIcons name='location-on' size={22} color='#F59E0B' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDropoffPress} className='bg-white rounded-full p-3' style={{ elevation: 4 }}>
                            <MaterialCommunityIcons name='flag-checkered' size={20} color='#10B981' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCurrentLocationPress} className='bg-white rounded-full p-3' style={{ elevation: 4 }}>
                            <Ionicons name='locate' size={22} color='#3B82F6' />
                        </TouchableOpacity>
                    </View>

                    {isRouteLoading && (
                        <View className='absolute top-4 right-4 bg-white rounded-full px-3 py-2 flex-row items-center gap-2' style={{ elevation: 4 }}>
                            <ActivityIndicator size='small' color='#4CAF50' />
                            <Text className='text-xs text-gray-600 font-semibold'>Getting route...</Text>
                        </View>
                    )}
                </View>

                {/* Bottom Sheet */}
                <View className='flex-1 bg-white rounded-t-3xl -mt-5' style={{ elevation: 8 }}>
                    <View className='items-center pt-3 pb-1'>
                        <View className='w-10 h-1 rounded-full bg-gray-300' />
                    </View>

                    <View className='flex-1 px-5' style={{ paddingBottom: 24 }}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                            <View className='flex-row items-center justify-between mt-1 mb-2'>
                                <Text className='text-2xl font-bold text-gray-900'>Job Assigned</Text>
                                <View className='bg-green-50 rounded-xl px-3 py-1'>
                                    <Text className='text-sm font-bold text-green-600'>{data.jobId}</Text>
                                </View>
                            </View>

                            <View className='flex-row gap-3 mb-3'>
                                <View className='flex-1 bg-white rounded-2xl p-4 border border-gray-100' style={{ elevation: 2 }}>
                                    <Text className='text-xs font-bold text-gray-400 mb-1'>Customer Name</Text>
                                    <Text className='text-sm font-bold text-gray-900'>{data.userId?.fullName ?? '—'}</Text>
                                </View>
                                <View className='flex-1 flex-row items-center bg-white rounded-2xl p-4 border border-gray-100' style={{ elevation: 2 }}>
                                    <View className='flex-1'>
                                        <Text className='text-xs font-bold text-gray-400 mb-1'>Phone Number</Text>
                                        <Text className='text-sm font-bold text-gray-900'>{data.userId?.phoneNumber ?? '—'}</Text>
                                    </View>
                                    <Pressable onPress={() => Linking.openURL(`tel:${data.userId?.phoneNumber}`)}>
                                        <Ionicons name="call-outline" size={24} color="#4CAF50" />
                                    </Pressable>
                                </View>
                            </View>

                            {routeToPickup && (
                                <View className='bg-blue-50 rounded-2xl p-4 mb-4 flex-row justify-between items-center'>
                                    <View className='flex-row items-center gap-3'>
                                        <View className='w-12 h-12 rounded-full bg-blue-100 items-center justify-center'>
                                            <Ionicons name='navigate' size={24} color='#3B82F6' />
                                        </View>
                                        <View>
                                            <Text className='text-sm text-gray-500 font-medium'>Distance to Pickup</Text>
                                            <Text className='text-2xl font-bold text-gray-900'>
                                                {routeToPickup.distance.toFixed(1)} km
                                            </Text>
                                        </View>
                                    </View>
                                    <View className='items-end'>
                                        <Text className='text-sm text-gray-500 font-medium'>Est. time</Text>
                                        <Text className='text-xl font-bold text-gray-900'>
                                            {Math.round(routeToPickup.duration)} min
                                        </Text>
                                    </View>
                                </View>
                            )}

                            <View className='bg-white rounded-2xl p-4 mb-3 border border-gray-100' style={{ elevation: 2 }}>
                                <Text className='text-sm font-bold text-gray-400 mb-4'>ROUTE DETAILS</Text>

                                <TouchableOpacity onPress={handlePickupPress} className='flex-row mb-4'>
                                    <View className='items-center mr-4'>
                                        <View className='w-9 h-9 rounded-full bg-orange-100 items-center justify-center'>
                                            <MaterialIcons name='location-on' size={16} color='#F59E0B' />
                                        </View>
                                        <View className='w-0.5 h-8 bg-gray-200 mt-1' />
                                    </View>
                                    <View className='flex-1 pt-1'>
                                        <Text className='text-xs font-bold text-gray-400 mb-1'>PICKUP</Text>
                                        <Text className='text-sm font-semibold text-gray-900' numberOfLines={2}>
                                            {data.pickupLocation.address}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleDropoffPress} className='flex-row'>
                                    <View className='mr-4'>
                                        <View className='w-9 h-9 rounded-full bg-green-100 items-center justify-center'>
                                            <MaterialCommunityIcons name='flag-checkered' size={14} color='#10B981' />
                                        </View>
                                    </View>
                                    <View className='flex-1 pt-1'>
                                        <Text className='text-xs font-bold text-gray-400 mb-1'>DROP-OFF</Text>
                                        <Text className='text-sm font-semibold text-gray-900' numberOfLines={2}>
                                            {data.dropLocation.address}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {(data.scheduleDate || data.workNotes) && (
                                <View className='bg-white rounded-2xl p-4 mb-3 border border-gray-100' style={{ elevation: 2 }}>
                                    {data.scheduleDate && (
                                        <View className='flex-row items-center mb-2'>
                                            <MaterialCommunityIcons name='calendar-clock' size={18} color='#6B7280' />
                                            <Text className='text-sm text-gray-600 ml-2'>
                                                {new Date(data.scheduleDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                                {data.scheduleTime ? `  •  ${data.scheduleTime}` : ''}
                                            </Text>
                                        </View>
                                    )}
                                    {data.workNotes && (
                                        <View className='flex-row items-start'>
                                            <MaterialCommunityIcons name='note-text-outline' size={18} color='#6B7280' />
                                            <Text className='text-sm text-gray-600 ml-2 flex-1'>{data.workNotes}</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </ScrollView>

                        <View className='flex-row gap-3 mt-2'>
                            <TouchableOpacity
                                onPress={handleCancel}
                                disabled={isCancelling}
                                className={`flex-1 border-2 border-green-500 rounded-2xl py-4 items-center ${isCancelling ? 'opacity-50' : ''}`}
                            >
                                <Text className='text-green-600 font-bold text-base'>
                                    {isCancelling ? 'Cancelling...' : 'Cancel'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleStartJob}
                                disabled={isStartingJob}
                                className={`flex-2 bg-green-500 rounded-2xl py-4 items-center px-8 ${isStartingJob ? 'opacity-50' : ''}`}
                                style={{ elevation: 3 }}
                            >
                                <Text className='text-white font-bold text-base'>
                                    {isStartingJob ? 'Starting...' : 'START JOB'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Toast Component */}
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                fadeAnim={toast.fadeAnim}
                buttons={toast.buttons}
                style={toast.style}
                onHide={toast.hide}
            />
        </SafeAreaView>
    )
}

export default JobAssigned