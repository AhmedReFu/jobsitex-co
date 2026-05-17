import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { Job } from './types'

interface RecentJobCardProps {
  job: Job
  onViewPress: () => void
  onRebookPress: () => void
  isRebooking?: boolean
}

export const RecentJobCard: React.FC<RecentJobCardProps> = ({
  job,
  onViewPress,
  onRebookPress,
  isRebooking = false,
}) => (
  <View
    className='bg-white rounded-3xl p-5 mb-4'
    style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    }}
  >
    <View className='flex-row justify-between mb-10'>
      <View>
        <Text className='text-xl font-bold text-gray-dark'>{job.name}</Text>
        <Text className='text-lg text-gray-medium'>{job.date || 'Date not available'}</Text>
      </View>
      <Text className='text-lg font-bold text-primary'>{job.price || 'Price not available'}</Text>
    </View>

    <View className='flex-row gap-3'>
      <TouchableOpacity
        onPress={onViewPress}
        className='flex-1 bg-[#4CAF501A] py-4 rounded-xl'
      >
        <Text className='text-primary text-center font-bold text-xl'>View</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onRebookPress}
        disabled={isRebooking}
        className='flex-1 bg-primary py-4 rounded-xl items-center justify-center'
        style={isRebooking ? { opacity: 0.7 } : undefined}
      >
        {isRebooking ? (
          <ActivityIndicator color='#fff' size='small' />
        ) : (
          <Text className='text-white text-center font-bold text-xl'>REBOOK</Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
)
