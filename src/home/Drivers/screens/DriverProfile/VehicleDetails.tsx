import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../../../constants'

const VehicleDetails = ({ route }: any) => {
    const navigation = useNavigation()
    

    // Vehicle details data
    const vehicleData = {
        truckType: 'Dump Truck',
        plateNo: 'ABC-1234',
        payload: '10 Tons',
        axles: '3',
    }

    const handleRequestUpdate = () => {
        console.log('Request update')
        // Navigate to update vehicle details or show modal
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-100' edges={['top']}>
            <StatusBar style='dark'/>
            <ScrollView className='px-5' showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className='flex-row items-center  py-4 '>
                    <TouchableOpacity onPress={() => navigation.goBack()} className='p-2'>
                        <Text className='text-3xl font-bold'>←</Text>
                    </TouchableOpacity>
                    <Text className='text-2xl font-extrabold ml-3'>Vehicle Details</Text>
                </View>

                {/* Truck Image Card */}
                <View className='mx-4 mt-6 mb-6'>
                    <View className='rounded-3xl items-center justify-center  bg-blue-300' style={{ elevation: 4, height: 280 }}>
                         
                            <Image
                                source={Images.Car3}
                            className='w-56 h-36 '
                            resizeMode='contain'
                            />
                       
                    </View>
                </View>

                {/* Details Grid */}
                <View className='mx-4 mb-36 '>
                    {/* First Row */}
                    <View className='flex-row gap-4 mb-4'>
                        {/* Truck Type */}
                        <View className='flex-1 bg-white rounded-2xl p-5' style={{ elevation: 2 }}>
                            <Text className='text-gray-400 text-xs font-bold mb-2'>TRUCK TYPE</Text>
                            <Text className='text-2xl font-bold text-gray-800'>{vehicleData.truckType}</Text>
                        </View>

                        {/* Plate No */}
                        <View className='flex-1 bg-white rounded-2xl p-5' style={{ elevation: 2 }}>
                            <Text className='text-gray-400 text-xs font-bold mb-2'>PLATE NO</Text>
                            <Text className='text-2xl font-bold text-gray-800'>{vehicleData.plateNo}</Text>
                        </View>
                    </View>

                    {/* Second Row */}
                    <View className='flex-row gap-4'>
                        {/* Payload */}
                        <View className='flex-1 bg-white rounded-2xl p-5' style={{ elevation: 2 }}>
                            <Text className='text-gray-400 text-xs font-bold mb-2'>PAYLOAD</Text>
                            <Text className='text-2xl font-bold text-gray-800'>{vehicleData.payload}</Text>
                        </View>

                        {/* Axles */}
                        <View className='flex-1 bg-white rounded-2xl p-5' style={{ elevation: 2 }}>
                            <Text className='text-gray-400 text-xs font-bold mb-2'>AXLES</Text>
                            <Text className='text-2xl font-bold text-gray-800'>{vehicleData.axles}</Text>
                        </View>
          </View>
        </View>

        {/* Request Update Button */}
              <View className='mx-4 mb-4'>
                  <TouchableOpacity
                      onPress={handleRequestUpdate}
                      className='bg-green-500 rounded-2xl py-4 flex-row items-center justify-center'
            style={{ elevation: 4 }}
            activeOpacity={0.85}
          >
           
                        <Text className='text-white font-bold text-lg mr-2'>Request Update</Text>
                        <FontAwesome name="pencil-square-o" size={24} color='white' />
          </TouchableOpacity>
        </View>

        {/* Info Message */}
        <View className='mx-4 mb-8 flex-row items-center p-4 rounded-xl' style={{ backgroundColor: '#F3F4F6' }}>
          <View className='w-8 h-8 rounded-full bg-gray-400 items-center justify-center mr-3'>
            <Text className='text-white font-bold'>i</Text>
          </View>
          <Text className='flex-1 text-gray-500 text-sm leading-5'>
            Updates require admin approval before reflecting.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default VehicleDetails