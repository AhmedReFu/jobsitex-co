import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
    SectionList,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Notification {
    id: string
    title: string
    message: string
    icon: string
    iconBg: string
    isRead: boolean
}

const DriverAlert = () => {
    const notificationSections = [
        {
            title: 'Today',
            data: [
                {
                    id: '1',
                    title: 'New Category Services!',
                    message: 'Now the plumbing service is available',
                    icon: 'grid',
                    iconBg: '#4CAF50',
                    isRead: false,
                },
                {
                    id: '2',
                    title: 'New Category Services!',
                    message: 'Now the plumbing service is available',
                    icon: 'grid',
                    iconBg: '#4CAF50',
                    isRead: false,
                },
                {
                    id: '3',
                    title: 'New Category Services!',
                    message: 'Now the plumbing service is available',
                    icon: 'grid',
                    iconBg: '#4CAF50',
                    isRead: false,
                },
            ],
        },
        {
            title: 'Yesterday',
            data: [
                {
                    id: '4',
                    title: 'Scheduled Maintenance',
                    message: 'The booking system will be offline for 30 minutes tonight at 2 AM EST for critical...',
                    icon: 'calendar',
                    iconBg: '#A5D6A7',
                    isRead: true,
                },
            ],
        },
        {
            title: 'December 22, 2024',
            data: [
                {
                    id: '5',
                    title: 'New Category Services!',
                    message: 'Now the plumbing service is available',
                    icon: 'grid',
                    iconBg: '#C8E6C9',
                    isRead: true,
                },
            ],
        },
    ]

    const handleNotificationPress = (notification: Notification) => {
        console.log('Notification pressed:', notification)
    }

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            onPress={() => handleNotificationPress(item)}
            className='bg-white rounded-2xl p-5 mb-3 flex-row items-start'
            activeOpacity={0.7}
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
            }}
        >
            {/* Icon Container */}
            <View
                className='w-16 h-16 rounded-full items-center justify-center mr-4'
                style={{ backgroundColor: item.iconBg + '30' }}
            >
                <Ionicons name={item.icon as any} size={24} color={item.iconBg} />
            </View>

            {/* Content */}
            <View className='flex-1'>
                <Text className='text-xl font-bold text-gray-dark mb-1'>
                    {item.title}
                </Text>
                <Text className='text-lg text-gray-medium ' numberOfLines={2}>
                    {item.message}
                </Text>
            </View>

            {/* Unread indicator */}
            {!item.isRead && (
                <View className='w-2 h-2 rounded-full bg-primary ml-2 mt-2' />
            )}
        </TouchableOpacity>
    )

    const renderSectionHeader = ({ section }: any) => (
        <Text className='text-xl font-bold text-gray-dark mb-3 mt-2'>
            {section.title}
        </Text>
    )

    return (
        <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
            {/* Header */}
            <View className='flex-row items-center px-6 py-4 bg-gray-50'>
                {/* <TouchableOpacity className='mr-4' activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color="#1C1C1C" />
                </TouchableOpacity> */}
                <Text className='text-2xl font-bold text-gray-dark'>Alert</Text>
            </View>

            {/* Notifications List */}
            <SectionList
                sections={notificationSections}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
            />
        </SafeAreaView>
    )
}

export default DriverAlert