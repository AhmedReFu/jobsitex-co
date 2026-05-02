import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../../../../Navigation/type'

const DriverEditProfile = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    // State for form fields
    const [fullName, setFullName] = useState('Ahmed ReFat')
    const [email, setEmail] = useState('mdnazmulislam5990@gmail.com')
    const [address, setAddress] = useState('123 sain St, Anytown, USA')
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleImagePick = async () => {
        try {
            // Request permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your photos.')
                return
            }

            // Launch image picker
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
            Alert.alert('Error', 'Failed to pick image')
        }
    }

    const handleSaveChanges = async () => {
        // Validation
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name')
            return
        }

        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email')
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address')
            return
        }

        if (!address.trim()) {
            Alert.alert('Error', 'Please enter your address')
            return
        }

        setLoading(true)

        try {
            // API call to update profile
            console.log('Saving changes:', {
                fullName,
                email,
                address,
                profileImage,
            })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            Alert.alert('Success', 'Profile updated successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ])
        } catch (error) {
            console.error('Error updating profile:', error)
            Alert.alert('Error', 'Failed to update profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className='flex-row items-center px-6 py-4'>
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={28} color="#1C1C1C" />
                    </TouchableOpacity>
                    <Text className='text-2xl font-bold text-gray-dark ml-4'>
                        Edit Profile
                    </Text>
                </View>

                {/* Profile Image Section */}
                <View className='items-center my-8'>
                    <View className='relative'>
                        {/* Profile Image */}
                        <View
                            className='w-40 h-40 rounded-full bg-white items-center justify-center'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.15,
                                shadowRadius: 12,
                                elevation: 10,
                            }}
                        >
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    className='w-full h-full rounded-full'
                                />
                            ) : (
                                <Ionicons name="person" size={80} color="#D1D5DB" />
                            )}
                        </View>

                        {/* Edit Image Button */}
                        <TouchableOpacity
                            onPress={handleImagePick}
                            className='absolute bottom-0 right-0 w-12 h-12 rounded-full bg-primary items-center justify-center border-4 border-white'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 5,
                            }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="camera" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Fields */}
                <View className='px-6'>
                    {/* Full Name */}
                    <View className='bg-white rounded-2xl px-5 py-4 flex-row items-center mb-4'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <Ionicons name="person-outline" size={24} color="#9CA3AF" />
                        <TextInput
                            className='flex-1 ml-4 text-base text-gray-dark'
                            placeholder='Full name'
                            placeholderTextColor='#D1D5DB'
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize='words'
                        />
                    </View>

                    {/* Email */}
                    <View className='bg-white rounded-2xl px-5 py-4 flex-row items-center mb-4'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <Ionicons name="mail-outline" size={24} color="#9CA3AF" />
                        <TextInput
                            className='flex-1 ml-4 text-base text-gray-dark'
                            placeholder='Enter your email'
                            placeholderTextColor='#D1D5DB'
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                    </View>

                    {/* Address */}
                    <View className='bg-white rounded-2xl px-5 py-4 flex-row items-center mb-8'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <Ionicons name="location-outline" size={24} color="#9CA3AF" />
                        <TextInput
                            className='flex-1 ml-4 text-base text-gray-dark'
                            placeholder='123 Main St, Anytown, USA'
                            placeholderTextColor='#D1D5DB'
                            value={address}
                            onChangeText={setAddress}
                            multiline
                        />
                    </View>
                </View>

                {/* Spacer for bottom button */}
                <View className='h-32' />
            </ScrollView>

            {/* Save Changes Button - Fixed at bottom */}
            <View className='absolute bottom-0 left-0 right-0 px-6 pb-8 bg-gray-50'>
                <TouchableOpacity
                    onPress={handleSaveChanges}
                    className={`bg-primary py-5 rounded-2xl ${loading ? 'opacity-70' : ''}`}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className='text-white text-center text-lg font-bold'>
                            SAVE CHANGES
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default DriverEditProfile