import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Document {
    id: string
    title: string
    subtitle: string
    status: 'verified' | 'pending' | 'upload'
    statusText: string
}

const DriverDocuments = () => {
    const navigation = useNavigation()
    const [documents, setDocuments] = useState<Document[]>([
        {
            id: '1',
            title: 'Driver License',
            subtitle: 'Expires 12/2025',
            status: 'verified',
            statusText: 'Verified',
        },
        {
            id: '2',
            title: 'Driver License',
            subtitle: 'Uploaded yesterday',
            status: 'pending',
            statusText: 'Pending...',
        },
        {
            id: '3',
            title: 'Vehicle Registration',
            subtitle: 'Expired 10/2023',
            status: 'upload',
            statusText: 'Upload',
        },
    ])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return '#22C55E'
            case 'pending':
                return '#F59E0B'
            case 'upload':
                return '#EF4444'
            default:
                return '#9CA3AF'
        }
    }

    const getSubtitleColor = (status: string) => {
        if (status === 'upload') {
            return '#EF4444'
        }
        return '#9CA3AF'
    }

    const handleUploadDocument = () => {
        console.log('Upload new document')
        // Navigate to upload screen
    }

    return (
        <SafeAreaView className='flex-1 ' edges={['top']}>
            <StatusBar style='dark'/>
            {/* Header */}
            <View className='flex-row items-center px-4 py-4'>
                <TouchableOpacity onPress={() => navigation.goBack()} className='p-2'>
                    <Text className='text-3xl'>←</Text>
                </TouchableOpacity>
                <Text className='text-2xl font-bold text-gray-dark ml-2'>Documents</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
                {/* Required Documents Section */}
                <View className='px-5 pt-6 mb-4'>
                    <Text className='text-2xl font-bold text-gray-dark'>Required Documents</Text>
                </View>

                {/* Documents List */}
                <View className='px-5 mb-8'>
          {documents.map((doc, index) => (
            <View key={doc.id} className='mb-4'>
              <TouchableOpacity
                className='bg-white rounded-2xl p-5 border border-[#f0f0f0] flex-row items-center justify-between'
                      style={{ elevation: 2 }}
                      activeOpacity={0.7}
                  >
                      { }
                <View className='flex-1'>
                  <Text className='text-xl font-bold text-gray-dark mb-1'>
                    {doc.title}
                  </Text>
                  <Text className='text-base' style={{ color: getSubtitleColor(doc.status) }}>
                    {doc.subtitle}
                  </Text>
                </View>

                {/* Right Status Badge */}
                <View className='ml-4'>
                  <Text
                    className='font-bold text-base'
                    style={{ color: getStatusColor(doc.status) }}
                  >
                    {doc.statusText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Spacer */}
        <View className='h-16' />
      </ScrollView>

      {/* Upload New Document Button */}
      <View className='px-5 pb-6'>
        <TouchableOpacity
          onPress={handleUploadDocument}
          className='bg-[#26A201] rounded-2xl py-5 flex-row items-center justify-center'
          style={{ elevation: 4 }}
          activeOpacity={0.8}
        >
          <Ionicons name='cloud-upload' size={24} color='white' />
          <Text className='text-white font-bold text-lg ml-2'>Upload New Document</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default DriverDocuments