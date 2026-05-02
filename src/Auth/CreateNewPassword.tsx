import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
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
import SuccessModal from '../Components/SuccessModal'

const CreateNewPassword = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const route = useRoute<RouteProp<AuthStackParamList, 'CreateNewPassword'>>()

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    // Get email and OTP from params
    const email = route.params?.email || ''
    const otp = route.params?.otp || ''

    const handleSubmit = async () => {
        // Clear previous error
        setError('')

        // Validation
        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields')
            return
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            console.log('Reset password for:', email)
            console.log('OTP:', otp)
            console.log('New password:', newPassword)

            // API call to reset password
            // const response = await resetPassword({ email, otp, newPassword })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Show success modal
            setShowSuccessModal(true)

        } catch (err) {
            setError('Failed to reset password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDone = () => {
        setShowSuccessModal(false)
        // Navigate to sign in
        navigation.navigate('SignIn')
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
                <Text className='text-3xl font-bold text-gray-dark mb-4'>
                    Create New Password
                </Text>

                {/* Subtitle */}
                <Text className='text-base text-gray-medium mb-8'>
                    Enter your new password
                </Text>

                {/* New Password Input */}
                <View className='bg-white rounded-2xl px-4 py-2 flex-row items-center mb-4 border border-gray-200'>
                    <Ionicons name="lock-closed-outline" size={24} color="#9CA3AF" />
                    <TextInput
                        className='flex-1 ml-3 text-base text-gray-dark'
                        placeholder='Enter new password'
                        placeholderTextColor='#9CA3AF'
                        value={newPassword}
                        onChangeText={(text) => {
                            setNewPassword(text)
                            setError('')
                        }}
                        secureTextEntry={!showNewPassword}
                        autoCapitalize='none'
                        editable={!loading}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                        <Ionicons
                            name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                            size={24}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View className='bg-white rounded-2xl px-4 py-2 flex-row items-center mb-2 border border-gray-200'>
                    <Ionicons name="lock-closed-outline" size={24} color="#9CA3AF" />
                    <TextInput
                        className='flex-1 ml-3 text-base text-gray-dark'
                        placeholder='Enter confirm password'
                        placeholderTextColor='#9CA3AF'
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text)
                            setError('')
                        }}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize='none'
                        editable={!loading}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                            size={24}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                </View>

                {/* Error Message */}
                {error ? (
                    <Text className='text-red-500 text-sm mb-6 ml-1'>
                        {error}
                    </Text>
                ) : (
                    <View className='mb-8' />
                )}

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    className={`bg-primary py-5 rounded-2xl ${loading ? 'opacity-70' : ''}`}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className='text-white text-center text-lg font-bold'>
                            SUBMIT
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccessModal}
                onClose={handleDone}
                title="Success!"
                subtitle="Your password is successfully created"
            />
        </SafeAreaView>
    )
}

export default CreateNewPassword