import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface StatusPoint {
    id: string
    title: string
    time: string
    description: string
    completed: boolean
    isCurrentActive?: boolean
    timeColor?: string
}

const DriverJobsDetails = ({ route }: any) => {
    const navigation = useNavigation()
    const [jobDetails] = useState({
        jobId: '#JOB-1024',
        status: 'On time',
        vehicle: {
            model: 'Volvo VNL 860',
            licensePlate: 'CA 55829',
            trailerType: '53\' Dry Van',
            weight: '42,000 lbs',
        },
        route: {
            pickupLocation: 'New York, NY',
            dropoffLocation: '2045 Lodgeville Road, Egan...',
        },
    })

    const [statusPoints] = useState<StatusPoint[]>([
        {
            id: '1',
            title: 'Booked',
            time: 'Oct 12 6:00 AM',
            description: 'Order confirmed details verified.',
            completed: true,
        },
        {
            id: '2',
            title: 'Driver Arrived',
            time: 'Oct 12 7:15 AM',
            description: 'Order confirmed details verified.',
            completed: true,
        },
        {
            id: '3',
            title: 'Loaded',
            time: 'Oct 12, 8:00 AM',
            description: 'Order confirmed details verified.',
            completed: true,
        },
        {
            id: '4',
            title: 'In Transit',
            time: 'Est 2:30 PM',
            description: 'Currently on 1-55 South heading towards St. Louis.',
            completed: false,
            isCurrentActive: true,
            timeColor: '#F59E0B',
        },
        {
            id: '5',
            title: 'Delivered',
            time: '',
            description: 'Pending arrival.',
            completed: false,
            timeColor: '#F59E0B',
        },
    ])

    const handleViewMap = () => {
        // map view not yet implemented
    }
    const handleBack = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}

                <View className='flex-row items-center px-6 py-4 bg-gray-50'>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={28} color="#1C1C1C" />
                    </TouchableOpacity>
                    <Text className='text-2xl font-bold text-gray-dark ml-4'>
                        Job Details
                    </Text>
                </View>

                {/* Map Section */}
                <View className='mx-4 mt-4 mb-6 rounded-2xl overflow-hidden' style={{ height: 250, elevation: 3 }}>
                    <ImageBackground
                        source={{ uri: 'https://via.placeholder.com/400x250/E0E7FF/6366F1?text=Live+Tracking+Map' }}
                        className='flex-1 items-center justify-center'
                        resizeMode='cover'
                    >
                        <View className='absolute top-4 left-4 flex-row items-center gap-2 bg-white px-3 py-2 rounded-lg'>
                            <View className='w-2 h-2 rounded-full bg-green-500' />
                            <Text className='text-sm font-semibold text-gray-800'>Live Tracking</Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleViewMap}
                            className='bg-white rounded-lg px-6 py-3 flex-row items-center gap-2'
                            style={{ elevation: 4 }}
                        >
                            <MaterialIcons name='map' size={20} color='#6B7280' />
                            <Text className='font-semibold text-gray-600'>View Map</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>

                {/* Status Section */}
                <View className='mx-4 mb-8'>
                    <View className='flex-row items-center justify-between mb-4'>
                        <Text className='text-2xl font-bold text-gray-900'>Status</Text>
                        <Text className='text-base font-semibold text-green-500'>{jobDetails.status}</Text>
                    </View>

                    {/* Timeline */}
                    <View className='bg-white rounded-2xl p-5' style={{ elevation: 2 }}>
                        {statusPoints.map((point, index) => (
                            <View key={point.id}>
                                <View className='flex-row'>
                                    <View className='items-center mr-4'>
                                        <View
                                            className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
                                                point.completed
                                                    ? 'bg-green-500 border-green-500'
                                                    : point.isCurrentActive
                                                      ? 'bg-green-500 border-green-500'
                                                      : 'bg-orange-300 border-orange-300'
                                            }`}
                                        >
                                            {point.completed || point.isCurrentActive ? (
                                                <Ionicons name='checkmark' size={16} color='white' />
                                            ) : (
                                                <View className='w-2 h-2 rounded-full bg-white' />
                                            )}
                                        </View>


                                        {index !== statusPoints.length - 1 && (
                                            <View className='w-0.5 h-12 bg-gray-300 my-1' />
                                        )}
                                    </View>


                                    <View className='flex-1 py-2'>
                                        <View className='flex-row items-center justify-between mb-1'>
                                            <Text className='text-base font-bold text-gray-900'>{point.title}</Text>
                                            <Text
                                                className='text-sm font-semibold'
                                                style={{ color: point.timeColor || '#9CA3AF' }}
                                            >
                                                {point.time}
                                            </Text>
                                        </View>
                                        <Text className='text-sm text-gray-500'>{point.description}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Vehicle Info Section */}
                <View className='mx-4 mb-8'>
                    <View className='flex-row items-center mb-4'>
                        <Text className='text-2xl font-bold text-gray-900 flex-1'>VEHICLE INFO</Text>
                        <View className='w-10 h-10 rounded-full bg-blue-100 items-center justify-center'>
                            <MaterialIcons name='local-shipping' size={20} color='#3B82F6' />
                        </View>
                    </View>

                    <View className='bg-white rounded-2xl p-5' style={{ elevation: 2 }}>
                        {/* First Row */}
                        <View className='flex-row gap-4 mb-6 pb-6 border-b border-gray-200'>
                            <View className='flex-1'>
                                <Text className='text-xs font-semibold text-gray-500 mb-2'>Vehicle Model</Text>
                                <Text className='text-base font-bold text-gray-900'>{jobDetails.vehicle.model}</Text>
                            </View>
                            <View className='flex-1'>
                                <Text className='text-xs font-semibold text-gray-500 mb-2'>License Plate</Text>
                                <Text className='text-base font-bold text-gray-900'>{jobDetails.vehicle.licensePlate}</Text>
                            </View>
                        </View>

                        {/* Second Row */}
                        <View className='flex-row gap-4'>
                            <View className='flex-1'>
                                <Text className='text-xs font-semibold text-gray-500 mb-2'>Trailer Type</Text>
                                <Text className='text-base font-bold text-gray-900'>{jobDetails.vehicle.trailerType}</Text>
                            </View>
                            <View className='flex-1'>
                                <Text className='text-xs font-semibold text-gray-500 mb-2'>Weight</Text>
                                <Text className='text-base font-bold text-gray-900'>{jobDetails.vehicle.weight}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Route Details Section */}
                <View className='mx-4 mb-12'>
                    <Text className='text-2xl font-bold text-gray-900 mb-4'>Route Details</Text>

                    <View className='bg-white rounded-2xl p-5' style={{ elevation: 2 }}>
                        {/* Pickup Location */}
                        <View className='flex-row mb-6 pb-6 border-b border-gray-200'>
                            <View className='mr-4'>
                                <View className='w-8 h-8 rounded-full bg-orange-100 items-center justify-center'>
                                    <Ionicons name='location' size={16} color='#F59E0B' />
                                </View>
                                <View className='w-0.5 h-8 bg-gray-300 mt-2 ml-3.5' />
                            </View>
                            <View className='flex-1'>
                                <Text className='text-xs font-bold text-gray-500 mb-1'>PICKUP LOCATION</Text>
                                <Text className='text-base font-semibold text-gray-900'>{jobDetails.route.pickupLocation}</Text>
                            </View>
                        </View>

                        {/* Dropoff Location */}
                        <View className='flex-row'>
                            <View className='mr-4'>
                                <View className='w-8 h-8 rounded-full bg-green-100 items-center justify-center'>
                                    <Ionicons name='location' size={16} color='#10B981' />
                                </View>
                            </View>
                            <View className='flex-1'>
                                <Text className='text-xs font-bold text-gray-500 mb-1'>DROP-OFF LOCATION</Text>
                                <Text className='text-base font-semibold text-gray-900'>{jobDetails.route.dropoffLocation}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DriverJobsDetails