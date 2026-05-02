import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../../Navigation/type'

const DriverProfile = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const [profileImage, setProfileImage] = useState<string | null>(null)

    // User data - replace with actual user data from context/redux
    const user = {
        name: 'Ahmed ReFat',
        email:"mdnazmulislam5990@gmail.com",
        vehicle: 'Dump Truck - 10T',
        address: '123 Main St, Anytown, USA',
    }

    const handleImagePick = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            })

            if (!result.canceled) {
                setProfileImage(result.assets[0].uri)
            }
        } catch (error) {
            console.error('Error picking image:', error)
        }
    }

    const handleEditProfile = () => {
        console.log('Edit profile')
        navigation.navigate("DriverEditProfile")
        // Navigate to edit profile screen
    }

    const handleNotifications = () => {
        console.log('Notifications settings')
        navigation.navigate("UserNotificationSettings")
        // Navigate to notifications settings
    }
    const handleVehicleDetails = () => {
        console.log('Notifications settings')
        navigation.navigate("VehicleDetails")
        // Navigate to notifications settings
    }
    const handleDocumentsVerification  = () => {
        console.log('Notifications settings')
        navigation.navigate("DriverDocuments")
        // Navigate to notifications settings
    }
    const handleEarningsSummary = () => {
        console.log('Notifications settings')
        navigation.navigate("DriverEarnings")
        // Navigate to notifications settings
    }
    const handlePayout = () => {
        console.log('Notifications settings')
        navigation.navigate("DriverPayout")
        // Navigate to notifications settings
    }

    const handleChangePassword = () => {
        console.log('Change password')
        // Navigate to change password screen
        navigation.navigate("UserPasswordChange")
    }
    const handleDeleteAccount = () => {
        console.log('Delete Account')
        // Navigate to change password screen
    }

    const handlePrivacyPolicy = () => {
        console.log('Privacy policy')
        // Navigate to privacy policy screen
        navigation.navigate("UserPrivacyPolicy")
    }

    const handleHelpSupport = () => {
        console.log('Help & Support')
        // Navigate to help & support screen
        navigation.navigate("UserHelpSupport")
    }

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        console.log('Logging out...')
                        // Perform logout
                    },
                },
            ]
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
            
                {/* Header */}
                <View className='items-center p-2'>
                    <Text className='text-2xl font-bold text-gray-dark'>My Profile</Text>
                </View>
            <ScrollView showsVerticalScrollIndicator={false} className='mx-5'>
                {/* Profile Image Section */}
                <View className='items-center mb-6'>
                    <View className='relative'>
                        {/* Profile Image */}
                        <View className='w-32 h-32 rounded-full bg-white items-center justify-center mt-6'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 8,
                            }}
                        >
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    className='w-full h-full rounded-full'
                                />
                            ) : (
                                <Ionicons name="person" size={64} color="#D1D5DB" />
                            )}
                        </View>

                        {/* Edit Image Button */}
                        <TouchableOpacity
                            onPress={handleImagePick}
                            className='absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary items-center justify-center border-4 border-white'
                            activeOpacity={0.8}
                        >
                            <Ionicons name="camera" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* User Name */}
                    <Text className='text-2xl font-bold text-gray-dark mt-4'>
                        {user.name}
                    </Text>

                    {/* User Email */}
                    <Text className='text-base text-gray-medium mt-1'>
                        {user.vehicle}
                    </Text>
                </View>

                <View className='flex-row justify-between gap-3 mb-6'>
                    <View className='flex-1 bg-white rounded-2xl py-6 border border-[#f0f0f0] items-center' style={{ elevation: 3 }}>
                        <View className='w-14 h-14 rounded-full bg-green-100 items-center justify-center mb-3'>
                            <MaterialCommunityIcons name="message-plus" size={28} color="#26A201" />
                        </View>
                        <Text className='text-2xl font-bold text-gray-800'>4.9</Text>
                        <Text className='text-base text-gray-400 mt-1'>Review</Text>
                    </View>
                    <View className='flex-1 bg-white rounded-2xl py-6 border border-[#f0f0f0] items-center' style={{ elevation: 3 }}>
                        <View className='w-14 h-14 rounded-full bg-green-100 items-center justify-center mb-3'>
                            <FontAwesome6 name="truck" size={28} color="#26A201" />
                        </View>
                        <Text className='text-2xl font-bold text-gray-800'>240</Text>
                        <Text className='text-base text-gray-400 mt-1'>Jobs</Text>
                    </View>
                    <View className='flex-1 bg-white rounded-2xl py-6 border border-[#f0f0f0] items-center' style={{ elevation: 3 }}>
                        <View className='w-14 h-14 rounded-full bg-green-100 items-center justify-center mb-3'>
                            <FontAwesome6 name="money-bills" size={28} color="#26A201" />
                        </View>
                        <Text className='text-2xl font-bold text-gray-800'>$4.2k</Text>
                        <Text className='text-base text-gray-400 mt-1'>Earnings</Text>
                    </View>
                </View>
                
                {/* Personal Information Card */}
                <View className=' mb-4'>
                    <View className='bg-white rounded-3xl p-6 border border-[#ececec]'

                    >
                        {/* Header with Edit Button */}
                        <View className='flex-row items-center justify-between mb-4'>
                            <Text className='text-xl font-bold text-gray-dark'>
                                Personal Information
                            </Text>
                            <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.7}>
                                <Ionicons name="create-outline" size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Name */}
                        <View className='flex-row items-center mb-4'>
                            <Ionicons name="person-outline" size={24} color="#9CA3AF" />
                            <Text className='text-base text-gray-dark ml-4'>
                                {user.name}
                            </Text>
                        </View>

                        {/* Email */}
                        <View className='flex-row items-center mb-4'>
                            <Ionicons name="mail-outline" size={24} color="#9CA3AF" />
                            <Text className='text-base text-gray-dark ml-4'>
                                {user.email}
                            </Text>
                        </View>

                        {/* Address */}
                        <View className='flex-row items-center'>
                            <Ionicons name="location-outline" size={24} color="#9CA3AF" />
                            <Text className='text-base text-gray-dark ml-4 flex-1'>
                                {user.address}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Job Card */}
                <View className='  mb-4'>
                    <View className='bg-white rounded-3xl p-6 border border-[#ececec]'
                    >
                        {/* Header */}
                        <Text className='text-xl font-bold text-gray-dark mb-4'>
                            Job information
                        </Text>

                        {/* Notifications */}
                        <TouchableOpacity
                            onPress={handleVehicleDetails}
                            className='flex-row items-center justify-between py-3'
                            activeOpacity={0.7}
                        >
                            <View className='flex-row items-center flex-1'>
                                <MaterialCommunityIcons name="dump-truck" size={24} color="#9CA3AF" />
                                <Text className='text-base text-gray-dark ml-4'>
                                    Vehicle Details
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className='h-px bg-gray-200 my-2' />

                        {/* Change Password */}
                        <TouchableOpacity
                            onPress={handleDocumentsVerification}
                            className='flex-row items-center justify-between py-3'
                            activeOpacity={0.7}
                        >
                            <View className='flex-row items-center flex-1'>
                                <MaterialIcons name="verified-user" size={24} color="#9CA3AF" />
                                <Text className='text-base text-gray-dark ml-4'>
                                    Documents & Verification
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        {/* Divider */}
                        <View className='h-px bg-gray-200 my-2' />

                        {/* Delete Account */}
                        <TouchableOpacity
                            onPress={handleEarningsSummary}
                            className='flex-row items-center justify-between py-3'
                            activeOpacity={0.7}
                        >
                            <View className='flex-row items-center flex-1'>
                                <MaterialIcons name="attach-money" size={24} color="#9CA3AF" />
                                <Text className='text-base text-gray-dark ml-4'>
                                    Earnings Summary
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className='h-px bg-gray-200 my-2' />

                        {/* Privacy Policy */}
                        <TouchableOpacity
                            onPress={handlePayout}
                            className='flex-row items-center justify-between py-3'
                            activeOpacity={0.7}
                        >
                            <View className='flex-row items-center flex-1'>
                                <FontAwesome name="cc-stripe" size={24} color="#9CA3AF" />
                                <Text className='text-base text-gray-dark ml-4'>
                                    Payout & Stripe
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                         
                    </View>
                </View>
                {/* Settings Card */}
                <View className='  mb-4'>
                    <View className='bg-white rounded-3xl p-6 border border-[#ececec]'
                    >
                        {/* Header */}
                        <Text className='text-xl font-bold text-gray-dark mb-4'>
                            Settings
                        </Text>

                        {/* Notifications */}
                        <TouchableOpacity
                            onPress={handleNotifications}
                            className='flex-row items-center justify-between py-3'
                            activeOpacity={0.7}
                        >
                            <View className='flex-row items-center flex-1'>
                                <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
                                <Text className='text-base text-gray-dark ml-4'>
                                    Notifications
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className='h-px bg-gray-200 my-2' />

                        {/* Change Password */}
                        <TouchableOpacity
                            onPress={handleChangePassword}
                            className='flex-row items-center justify-between py-3'
                            activeOpacity={0.7}
                        >
                            <View className='flex-row items-center flex-1'>
                                <Ionicons name="lock-closed-outline" size={24} color="#9CA3AF" />
                                <Text className='text-base text-gray-dark ml-4'>
                                    Change Password
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                        {/* Divider */}
                        <View className='h-px bg-gray-200 my-2' />

                        {/* Delete Account */}
                        <TouchableOpacity
                            onPress={handleDeleteAccount}
                            className='flex-row items-center justify-between py-3'
                            activeOpacity={0.7}
                        >
                            <View className='flex-row items-center flex-1'>
                                <Ionicons name="lock-closed-outline" size={24} color="#9CA3AF" />
                                <Text className='text-base text-gray-dark ml-4'>
                                    Delete Account
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className='h-px bg-gray-200 my-2' />

                        {/* Privacy Policy */}
                        <TouchableOpacity
                            onPress={handlePrivacyPolicy}
                            className='flex-row items-center justify-between py-3'
                            activeOpacity={0.7}
                        >
                            <View className='flex-row items-center flex-1'>
                                <Ionicons name="shield-checkmark-outline" size={24} color="#9CA3AF" />
                                <Text className='text-base text-gray-dark ml-4'>
                                    Privacy policy
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className='h-px bg-gray-200 my-2' />

                        {/* Help & Support */}
                        <TouchableOpacity
                            onPress={handleHelpSupport}
                            className='flex-row items-center justify-between py-3'
                            activeOpacity={0.7}
                        >
                            <View className='flex-row items-center flex-1'>
                                <Ionicons name="help-circle-outline" size={24} color="#9CA3AF" />
                                <Text className='text-base text-gray-dark ml-4'>
                                    Help & Support
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Logout Button */}
                <View className=' mb-28'>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className='bg-white rounded-2xl py-5 flex-row items-center justify-center border border-[#ececec]'
                        activeOpacity={0.7}
                    >
                        <Ionicons name="log-out-outline" size={28} color="#EF4444" />
                        <Text className='text-2xl font-bold text-red-500 ml-3'>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DriverProfile