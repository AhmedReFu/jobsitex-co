import { Entypo, MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ImageBackground, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../../../Navigation/type'

const CurrentJob = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const [jobData] = useState({
        status: 'JOB IN PROGRESS',
        title: 'Loading Complete - En route to destination',
        jobId: '#TDX-9921',
        pickup: '123 Industrial Park Rd, Chicago, IL 60601',
        dropoff: '456 Warehouse Blvd, St. Louis, MO 63101',
        eta: '2h 15m',
        distance: '85 km',
    })

    const handleComplete = () => {
        navigation.navigate('DriverJobsComplete', { jobId: '1' })
    }

    return (
        <SafeAreaView className='flex-1 bg-white' edges={['top']}>
            <StatusBar barStyle='dark-content' />

            {/* Map Section */}
            <View className='relative h-2/5 bg-gray-200'>
                <ImageBackground
                    source={{ uri: 'https://via.placeholder.com/400x300/E0E7FF/6366F1?text=Route+Map' }}
                    className='flex-1'
                    resizeMode='cover'
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className='absolute top-4 left-4 bg-white rounded-lg p-2 z-10'
                        style={{ elevation: 3 }}
                    >
                        <Entypo name='chevron-left' size={24} color='#000' />
                    </TouchableOpacity>

                    {/* Status Badge */}
                    <View className='absolute top-4 right-4 bg-orange-500 rounded-full px-4 py-2 flex-row items-center gap-2' style={{ elevation: 3 }}>
                        <MaterialIcons name='schedule' size={16} color='white' />
                        <Text className='text-white font-bold text-sm'>{jobData.status}</Text>
                    </View>
                </ImageBackground>
            </View>

            {/* Bottom Sheet Content */}
            <ScrollView className='flex-1 bg-white px-5 pt-6 pb-6' showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text className='text-2xl font-bold text-gray-900 mb-2'>{jobData.title}</Text>
                <Text className='text-base text-gray-600 mb-6'>Job {jobData.jobId}</Text>

                {/* Route Details Section */}
                <View className='bg-white rounded-2xl p-5 mb-6' style={{ elevation: 2 }}>
                    <Text className='text-lg font-bold text-gray-900 mb-4'>ROUTE DETAILS</Text>

                    {/* Pickup */}
                    <View className='flex-row mb-6 pb-6 border-b border-gray-200'>
                        <View className='mr-4'>
                            <View className='w-8 h-8 rounded-full bg-orange-100 items-center justify-center'>
                                <MaterialIcons name='location-on' size={16} color='#F59E0B' />
                            </View>
                            <View className='w-0.5 h-8 bg-gray-300 mt-2 ml-3.5' />
                        </View>
                        <View className='flex-1'>
                            <Text className='text-xs font-bold text-gray-500 mb-1'>PICKUP LOCATION</Text>
                            <Text className='text-base font-semibold text-gray-900'>{jobData.pickup}</Text>
                        </View>
                    </View>

                    {/* Dropoff */}
                    <View className='flex-row'>
                        <View className='mr-4'>
                            <View className='w-8 h-8 rounded-full bg-green-100 items-center justify-center'>
                                <MaterialIcons name='location-on' size={16} color='#10B981' />
                            </View>
                        </View>
                        <View className='flex-1'>
                            <Text className='text-xs font-bold text-gray-500 mb-1'>DROP-OFF LOCATION</Text>
                            <Text className='text-base font-semibold text-gray-900'>{jobData.dropoff}</Text>
                        </View>
                    </View>
                </View>

                {/* Trip Details Grid */}
                <View className='flex-row gap-3 mb-6'>
                    {/* ETA */}
                    <View className='flex-1 bg-gray-50 rounded-2xl p-4'>
                        <View className='flex-row items-center gap-2 mb-2'>
                            <MaterialIcons name='schedule' size={16} color='#6B7280' />
                            <Text className='text-xs text-gray-600'>ETA</Text>
                        </View>
                        <Text className='text-lg font-bold text-gray-900'>{jobData.eta}</Text>
                    </View>

                    {/* Distance */}
                    <View className='flex-1 bg-gray-50 rounded-2xl p-4'>
                        <View className='flex-row items-center gap-2 mb-2'>
                            <MaterialIcons name='location-on' size={16} color='#6B7280' />
                            <Text className='text-xs text-gray-600'>Distance</Text>
                        </View>
                        <Text className='text-lg font-bold text-gray-900'>{jobData.distance}</Text>
                    </View>
                </View>

                {/* Complete Job Button */}
                <TouchableOpacity
                    onPress={handleComplete}
                    className='bg-green-500 rounded-2xl py-4 items-center justify-center'
                    style={{ elevation: 3 }}
                >
                    <MaterialIcons name='check-circle' size={24} color='white' />
                    <Text className='text-white font-bold text-lg mt-1'>Complete Job</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CurrentJob
