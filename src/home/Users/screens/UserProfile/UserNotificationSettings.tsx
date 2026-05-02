import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../../../Navigation/type'

const UserNotificationSettings = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    // Notification preferences state
    const [jobUpdates, setJobUpdates] = useState(true)
    const [systemAlerts, setSystemAlerts] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)

    const handleBack = () => {
        navigation.goBack()
    }

    const handleSaveSettings = async () => {
        try {
            // API call to save notification preferences
            console.log('Saving notification settings:', {
                jobUpdates,
                systemAlerts,
                pushNotifications,
                emailNotifications,
            })

            // Show success message
            // Alert.alert('Success', 'Notification settings saved')
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }

    // Auto-save whenever a setting changes
    React.useEffect(() => {
        handleSaveSettings()
    }, [jobUpdates, systemAlerts, pushNotifications, emailNotifications])

    return (
        <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className='flex-row items-center px-6 py-4'>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={28} color="#1C1C1C" />
                    </TouchableOpacity>
                    <Text className='text-2xl font-bold text-gray-dark ml-4'>
                        Notifications
                    </Text>
                </View>

                {/* Alerts Card */}
                <View className='mx-6 mt-4 mb-4'>
                    <View
                        className='bg-white rounded-3xl p-6'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        {/* Section Title */}
                        <Text className='text-xl font-bold text-gray-dark mb-6'>
                            Alerts
                        </Text>

                        {/* Job Updates */}
                        <View className='mb-6'>
                            <View className='flex-row items-start justify-between mb-2'>
                                <View className='flex-1 mr-4'>
                                    <Text className='text-base font-semibold text-gray-dark mb-2'>
                                        Job Updates
                                    </Text>
                                    <Text className='text-sm text-gray-medium leading-5'>
                                        Receive updates on new job postings,and other important job-related information.
                                    </Text>
                                </View>
                                <Switch
                                    value={jobUpdates}
                                    onValueChange={setJobUpdates}
                                    trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                                    thumbColor='#FFFFFF'
                                    ios_backgroundColor="#D1D5DB"
                                />
                            </View>
                        </View>

                        {/* System Alerts */}
                        <View>
                            <View className='flex-row items-start justify-between'>
                                <View className='flex-1 mr-4'>
                                    <Text className='text-base font-semibold text-gray-dark mb-2'>
                                        System Alerts
                                    </Text>
                                    <Text className='text-sm text-gray-medium leading-5'>
                                        Stay informed about system maintenance, updates, and other critical alerts.
                                    </Text>
                                </View>
                                <Switch
                                    value={systemAlerts}
                                    onValueChange={setSystemAlerts}
                                    trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                                    thumbColor='#FFFFFF'
                                    ios_backgroundColor="#D1D5DB"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Notification Methods Card */}
                <View className='mx-6 mb-6'>
                    <View
                        className='bg-white rounded-3xl p-6'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        {/* Push Notifications */}
                        <View className='flex-row items-center justify-between mb-6'>
                            <Text className='text-base font-semibold text-gray-dark'>
                                Push Notifications
                            </Text>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                                thumbColor='#FFFFFF'
                                ios_backgroundColor="#D1D5DB"
                            />
                        </View>

                        {/* Divider */}
                        <View className='h-px bg-gray-200 mb-6' />

                        {/* Email Notifications */}
                        <View className='flex-row items-center justify-between'>
                            <Text className='text-base font-semibold text-gray-dark'>
                                Email
                            </Text>
                            <Switch
                                value={emailNotifications}
                                onValueChange={setEmailNotifications}
                                trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
                                thumbColor='#FFFFFF'
                                ios_backgroundColor="#D1D5DB"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserNotificationSettings