import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../Navigation/type'

const ForgotPassword = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSendOtp = async () => {
        // Clear previous error
        setError('')

        // Validate email
        if (!email.trim()) {
            setError('Please enter your email')
            return
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        setLoading(true)

        try {
            // API call to send OTP
            
            console.log('Sending OTP to:', email)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            await (navigation as any).navigate('OtpVerification', { email })
            
            // Navigate to OTP verification
        } catch (err) {
            setError('Failed to send OTP. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-6 flex-1'>
                {/* Back Button */}
                <TouchableOpacity
                    onPress={handleBack}
                    className='mt-4 mb-8'
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={28} color="#1C1C1C" />
                </TouchableOpacity>

                {/* Title */}
                <Text className='text-4xl font-bold text-gray-dark mb-4'>
                    Forgot Password
                </Text>

                {/* Subtitle */}
                <Text className='text-base text-gray-medium mb-8'>
                    Recover your account password
                </Text>

                {/* Email Input */}
                <View
                    className={`bg-white rounded-2xl px-4 py-2 flex-row items-center mb-2 border ${error ? 'border-red-500' : 'border-gray-200'
                        }`}
                >
                    <Ionicons name="mail-outline" size={24} color="#9CA3AF" />
                    <TextInput
                        className='flex-1 ml-3 text-base text-gray-dark'
                        placeholder='Enter your email'
                        placeholderTextColor='#9CA3AF'
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text)
                            setError('') // Clear error on typing
                        }}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        editable={!loading}
                    />
                </View>

                {/* Error Message */}
                {error ? (
                    <Text className='text-red-500 text-sm mb-6 ml-1'>
                        {error}
                    </Text>
                ) : (
                    <View className='mb-8' />
                )}

                {/* Send OTP Button */}
                <TouchableOpacity
                    onPress={handleSendOtp}
                    className={`bg-primary py-5 rounded-2xl ${loading ? 'opacity-70' : ''}`}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className='text-white text-center text-lg font-bold'>
                            SENT OTP
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ForgotPassword