import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import { IPA_BASE } from '@env'
import React, { useRef, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthStackParamList } from '../Navigation/type'

const OtpVerification = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const route = useRoute<RouteProp<AuthStackParamList, 'OtpVerification'>>()

    const [otp, setOtp] = useState(['', '', '', ''])
    const [resending, setResending] = useState(false)
    const inputRefs = useRef<(TextInput | null)[]>([])

    const email = route.params?.email ?? ''

    const handleOtpChange = (value: string, index: number) => {
        if (value && !/^\d+$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }

        if (index === 3 && value) {
            const fullOtp = [...newOtp.slice(0, 3), value].join('')
            if (fullOtp.length === 4) {
                setTimeout(() => handleVerify(fullOtp), 300)
            }
        }
    }

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleResend = async () => {
        if (!email) return
        setResending(true)
        try {
            await axios.post(
                `${IPA_BASE}/auth/forgot-password`,
                { email },
                { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
            )
            setOtp(['', '', '', ''])
            inputRefs.current[0]?.focus()
            Alert.alert('Sent', 'A new OTP has been sent to your email.')
        } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to resend OTP.')
        } finally {
            setResending(false)
        }
    }

    const handleVerify = (otpOverride?: string) => {
        const otpCode = otpOverride ?? otp.join('')
        if (otpCode.length === 4) {
            navigation.navigate('CreateNewPassword', { email, otp: otpCode })
        } else {
            Alert.alert('Incomplete', 'Please enter the complete 4-digit OTP.')
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className='px-6 flex-1'>
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className='mt-4 mb-8'
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={28} color="#1C1C1C" />
                </TouchableOpacity>

                {/* Title */}
                <Text className='text-3xl font-bold text-gray-dark text-center mb-4'>
                    OTP Verification
                </Text>

                {/* Description */}
                <Text className='text-base text-gray-medium text-center mb-8'>
                    We have sent a verification code to{'\n'}
                    <Text className='text-gray-dark font-semibold'>{email}</Text>
                </Text>

                {/* OTP Input Boxes */}
                <View className='flex-row justify-center gap-4 mb-6'>
                    {otp.map((digit, index) => (
                        <View
                            key={index}
                            className={`w-16 h-16 rounded-2xl border-2 items-center justify-center ${digit ? 'border-primary bg-white' : 'bg-white border-gray-200'}`}
                        >
                            <TextInput
                                ref={(ref) => { inputRefs.current[index] = ref }}
                                className='text-2xl font-bold text-primary text-center'
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType='number-pad'
                                maxLength={1}
                                selectTextOnFocus
                                style={{ width: '100%', height: '100%', textAlign: 'center' }}
                            />
                        </View>
                    ))}
                </View>

                {/* Resend Link */}
                <View className='flex-row justify-center mb-8'>
                    <Text className='text-gray-medium text-sm'>Don't receive the OTP? </Text>
                    <TouchableOpacity onPress={handleResend} disabled={resending}>
                        {resending ? (
                            <ActivityIndicator size="small" color="#4CAF50" />
                        ) : (
                            <Text className='text-primary font-semibold text-sm'>Resend</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className='flex-1' />

                {/* Verify Button */}
                <TouchableOpacity
                    onPress={() => handleVerify()}
                    className='bg-primary py-5 rounded-2xl mb-8'
                    activeOpacity={0.8}
                >
                    <Text className='text-white text-center text-lg font-bold'>VERIFY</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default OtpVerification
