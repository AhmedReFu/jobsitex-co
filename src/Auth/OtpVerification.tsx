import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import {
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
    const inputRefs = useRef<(TextInput | null)[]>([])

    // Get email from navigation params
    const email = route.params?.email || 'abcd@gmail.com'

    const handleOtpChange = (value: string, index: number) => {
        if (value && !/^\d+$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }

        // Auto verify if all 4 digits entered
        if (index === 3 && value) {
            const fullOtp = [...newOtp.slice(0, 3), value].join('')
            if (fullOtp.length === 4) {
                setTimeout(() => handleVerify(), 300)
            }
        }
    }

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleResend = () => {
        console.log('Resend OTP to:', email)
        setOtp(['', '', '', ''])
        inputRefs.current[0]?.focus()
        // API call to resend OTP
    }

    const handleVerify = () => {
        const otpCode = otp.join('')
        if (otpCode.length === 4) {
            console.log('Verify OTP:', otpCode)
            // Navigate to CreateNewPassword with email and OTP
            navigation.navigate('CreateNewPassword', {
                email: email,
                otp: otpCode
            })
        } else {
            alert('Please enter complete OTP')
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
                <Text className='text-3xl font-bold text-gray-dark text-center mb-4'>
                    OTP Verification
                </Text>

                {/* Description */}
                <Text className='text-base text-gray-medium text-center mb-8'>
                    We have sent verification code on{'\n'}
                    <Text className='text-gray-dark'>{email}</Text>
                </Text>

                {/* OTP Input Boxes */}
                <View className='flex-row justify-center gap-4 mb-6'>
                    {otp.map((digit, index) => (
                        <View
                            key={index}
                            className={`w-16 h-16 rounded-2xl border-2 items-center justify-center ${digit
                                    ? 'border-primary bg-white'
                                    : 'bg-white border-gray-200'
                                }`}
                        >
                            <TextInput
                                ref={(ref) => {
                                    inputRefs.current[index] = ref
                                }}
                                className='text-2xl font-bold text-primary text-center'
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType='number-pad'
                                maxLength={1}
                                selectTextOnFocus
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    textAlign: 'center'
                                }}
                            />
                        </View>
                    ))}
                </View>

                {/* Resend Link */}
                <View className='flex-row justify-center mb-8'>
                    <Text className='text-gray-medium text-sm'>
                        Don't receive the OTP?{' '}
                    </Text>
                    <TouchableOpacity onPress={handleResend}>
                        <Text className='text-primary font-semibold text-sm'>
                            Resend
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Spacer */}
                <View className='flex-1' />

                {/* Verify Button */}
                <TouchableOpacity
                    onPress={handleVerify}
                    className='bg-primary py-5 rounded-2xl mb-8'
                    activeOpacity={0.8}
                >
                    <Text className='text-white text-center text-lg font-bold'>
                        VERIFY
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default OtpVerification