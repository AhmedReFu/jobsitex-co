import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const DriverJobsComplete = ({ route }: any) => {
    const navigation = useNavigation()
    const [jobData] = useState({
        route: {
            pickupLocation: 'New York, NY',
            dropoffLocation: '2045 Lodgeville Road, Egan...',
        },
        completion: {
            title: 'Delivered Successfully',
            date: 'Oct 24, 2023',
            status: 'On time',
        },
        payment: {
            vehicle: '$20',
            distance: '$15',
            additionalHours: '$10',
            serviceCharge: '$2',
            total: '$47',
        },
    })

    const handleDownloadReceipt = () => {
        console.log('Download Receipt')
    }

    const handleViewMap = () => {
        console.log('View Map')
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
            <StatusBar style='dark' />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className='px-4 py-4 bg-white border-b border-gray-200 flex-row items-center'>
                    <TouchableOpacity onPress={() => navigation.goBack()} className='p-2'>
                        <Text className='text-3xl'>←</Text>
                    </TouchableOpacity>
                    <Text className='text-2xl font-bold text-gray-900 ml-2'>Job Details</Text>
                </View>

                {/* Map Section */}
                <View className='mx-4 mt-4 mb-6 rounded-2xl overflow-hidden' style={{ height: 220, elevation: 3 }}>
                    <ImageBackground
                        source={{ uri: 'https://via.placeholder.com/400x220/E0E7FF/6366F1?text=Route+Map' }}
                        className='flex-1 items-center justify-center'
                        resizeMode='cover'
                    >
                        <TouchableOpacity
                            onPress={handleViewMap}
                            className='bg-white rounded-lg px-5 py-2 flex-row items-center gap-2'
                            style={{ elevation: 4 }}
                        >
                            <MaterialIcons name='map' size={18} color='#6B7280' />
                            <Text className='font-semibold text-gray-600'>View Map</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>

                {/* Route Details */}
                <View className='mx-4 mb-5'>
                    <Text className='text-xl font-bold text-gray-900 mb-3'>Route Details</Text>

                    <View className='bg-white rounded-2xl p-5' style={{ elevation: 2 }}>
                        {/* Pickup */}
                        <View className='flex-row mb-6 pb-6 border-b border-gray-200'>
                            <View className='mr-4'>
                                <View className='w-8 h-8 rounded-full bg-orange-100 items-center justify-center'>
                                    <Ionicons name='location' size={16} color='#F59E0B' />
                                </View>
                                <View className='w-0.5 h-8 bg-gray-300 mt-2 ml-3.5' />
                            </View>
                            <View className='flex-1'>
                                <Text className='text-xs font-bold text-gray-500 mb-1'>PICKUP LOCATION</Text>
                                <Text className='text-base font-semibold text-gray-900'>{jobData.route.pickupLocation}</Text>
                            </View>
                        </View>

                        {/* Dropoff */}
                        <View className='flex-row'>
                            <View className='mr-4'>
                                <View className='w-8 h-8 rounded-full bg-green-100 items-center justify-center'>
                                    <Ionicons name='location' size={16} color='#10B981' />
                                </View>
                            </View>
                            <View className='flex-1'>
                                <Text className='text-xs font-bold text-gray-500 mb-1'>DROP-OFF LOCATION</Text>
                                <Text className='text-base font-semibold text-gray-900'>{jobData.route.dropoffLocation}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Delivery Status */}
                <View className='mx-4 mb-5'>
                    <View className='bg-white rounded-2xl p-5 border-l-4 border-green-500 flex-row items-center' style={{ elevation: 2 }}>
                        <View className='w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3'>
                            <Ionicons name='checkmark' size={20} color='#10B981' />
                        </View>
                        <View className='flex-1'>
                            <Text className='text-base font-bold text-gray-900'>{jobData.completion.title}</Text>
                            <Text className='text-sm text-gray-500'>{jobData.completion.date}</Text>
                        </View>
                        <Text className='text-green-500 font-bold text-sm'>{jobData.completion.status}</Text>
                    </View>
                </View>

                {/* Payment Details */}
                <View className='mx-4 mb-6'>
                    <Text className='text-lg font-bold text-gray-900 mb-3'>PAYMENT DETAILS</Text>

                    <View className='bg-white rounded-2xl p-5' style={{ elevation: 2 }}>
                        {/* Vehicle */}
                        <View className='flex-row justify-between items-center py-3 border-b border-gray-200'>
                            <Text className='text-gray-400'>Vehicle (Mini Truck)</Text>
                            <Text className='text-gray-900 font-bold'>{jobData.payment.vehicle}</Text>
                        </View>

                        {/* Distance */}
                        <View className='flex-row justify-between items-center py-3 border-b border-gray-200'>
                            <Text className='text-gray-400'>Distance Cost</Text>
                            <Text className='text-gray-900 font-bold'>{jobData.payment.distance}</Text>
                        </View>

                        {/* Hours */}
                        <View className='flex-row justify-between items-center py-3 border-b border-gray-200'>
                            <Text className='text-gray-400'>Additional Hours Cost</Text>
                            <Text className='text-gray-900 font-bold'>{jobData.payment.additionalHours}</Text>
                        </View>

                        {/* Service Charge */}
                        <View className='flex-row justify-between items-center py-3 border-b border-gray-200'>
                            <Text className='text-gray-400'>Service Charge</Text>
                            <Text className='text-gray-900 font-bold'>{jobData.payment.serviceCharge}</Text>
                        </View>

                        {/* Total */}
                        <View className='flex-row justify-between items-center py-4 mt-2'>
                            <View>
                                <Text className='text-gray-900 font-bold'>Total</Text>
                                <Text className='text-xs text-gray-400'>(Estimated Cost)</Text>
                            </View>
                            <Text className='text-3xl font-bold text-orange-500'>{jobData.payment.total}</Text>
                        </View>
                    </View>
                </View>

                {/* Download Receipt Button */}
                <View className='mx-4 mb-12'>
                    <TouchableOpacity
                        onPress={handleDownloadReceipt}
                        className='bg-green-500 rounded-xl py-4 flex-row items-center justify-center'
                        style={{ elevation: 4 }}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name='receipt' size={24} color='white' />
                        <Text className='text-white font-bold text-lg ml-2'>DOWNLOAD RECEIPT</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DriverJobsComplete