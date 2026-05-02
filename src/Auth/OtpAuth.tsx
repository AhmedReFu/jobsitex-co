import { IPA_BASE, OTP_AUTH } from '@env'
import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SuccessModal from '../Components/SuccessModal'
import { Toast, useToast } from '../Components/useToost'
import { AuthStackParamList } from '../Navigation/type'
import { Images } from '../constants'


const API_BASE_URL = IPA_BASE;
const END_POINTS = OTP_AUTH;

const OtpAuth = () => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
    const [otp, setOtp] = useState(['', '', '', ''])
    const inputRefs = useRef<Array<TextInput | null>>([])
    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const route = useRoute<any>();
    const toast = useToast();

    const type = route.params?.type;
    const email = route.params?.email;

    const handleDone = () => {

        setShowSuccessModal(false)
        // Navigate to next screen
        console.log('Navigate to home or next screen')
    }

    // Email from previous screen - you can pass via navigation params


    const handleOtpChange = (value: string, index: number) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value

        setOtp(newOtp)

        // Auto focus to next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyPress = (e: any, index: number) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleResend = () => {
        console.log('Resend OTP')
        // Clear OTP inputs
        setOtp(['', '', '', ''])
        inputRefs.current[0]?.focus()
    }

    const handleSignIn = () => {
        const otpCode = otp.join('')

    }
    const handleVerify = async () => {
        const otpCode = otp.join('')

        if (otpCode.length === 4) {
            console.log('Verify OTP:', otpCode)
            const otpNumber = Number(otp.join(''))
            try {
                setLoading(true);

                const res = await axios.post(
                    `${API_BASE_URL}/auth/verify-otp`,
                    {
                        email: email,
                        code: otpNumber
                    },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 15000,
                    },
                );

                const data = res?.data;
                console.log(data)
                console.log(res.data.data.role)
                if (data?.success === true) {

                    console.log(data.data)
                    setTimeout(() => {

                        if (res.data.data.role == "USER") {
                            setShowSuccessModal(true);
                            (navigation as any).replace("SignIn")
                        } else {
                            setShowSuccessModal(true);
                            (navigation as any).replace("ProfileSetup", {
                                accessToken: data.data.accessToken
                            })
                        }

                    }, 1500);

                } else {
                    console.log(data)
                    // Alert.alert('Sign in failed', data?.message || 'Invalid credentials');
                    toast.show({
                        message: ('Sign in failed' + data?.message || 'Invalid credentials'),
                        type: 'error',
                        style: 'top',
                    });
                }
            } catch (e: any) {
                const msg = e?.response?.data?.message || e?.message || 'Something went wrong';
                console.log(msg)
                if (msg == "Profile setup not completed. Please complete your profile first!") {
                    setTimeout(() => {
                        setShowSuccessModal(false);
                        navigation.navigate('ProfileSetup', { email: email.trim().toLowerCase() } as any);
                    }, 1500);
                }
                if (msg == "Account not activated. Please verify OTP first!") {
                    setTimeout(() => {
                        setShowSuccessModal(false);
                        navigation.navigate('OtpAuth', {
                            email: email.trim().toLowerCase(),
                        } as any);
                    }, 1500);

                }
                // Alert.alert('Sign in failed', msg);
                console.log(e?.response)
                toast.show({
                    message: msg,
                    type: 'error',
                    style: 'top',
                });
            } finally {
                setLoading(false);
            }
            // Navigate to next screen or verify OTP
            setShowSuccessModal(true)
        } else {
            toast.show({
                message: 'Please enter complete OTP.',
                type: 'error',
                style: 'top',
            });


        }
    };


    {/*
       "_id": "69a9d2aeca49e2ecf180f332",
        "email": "dodul4@driver.co",
        "fullName": "Dodul Dalle",
        "phoneNumber": "+8801812345680",
        "role": "USER",
        "profile": "profile is not set please update profile"
        "isVerified": true
    */}


    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <View className='px-6 flex-1'>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className={`absolute top-4 left-6 z-10 ${showSuccessModal ? 'opacity-0' : 'opacity-100'}`}

                >
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>

                <Image
                    source={Images.Logo}
                    className='self-center mt-8 mb-8'
                    style={{ width: 180, height: 180 }}
                    resizeMode='contain'
                />

                <Text className='text-3xl font-bold text-gray-dark text-center mb-4'>
                    OTP Verification
                </Text>

                <Text className='text-lg text-gray-medium text-center mb-8'>
                    We have sent verification code on{'\n'}
                    <Text className='text-gray-dark'>{email}</Text>
                </Text>

                <View className='flex-row justify-center gap-10 mb-6'>
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
                                className='text-2xl font-bold text-gray-dark text-center'
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

                <View className='flex-row justify-center mb-8'>
                    <Text className='text-gray-medium text-lg'>
                        Don't receive the OTP?{' '}
                    </Text>
                    <TouchableOpacity onPress={handleResend}>
                        <Text className='text-red-500 font-semibold text-lg'>
                            Resend
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className='flex-1' />
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
            <SuccessModal
                visible={showSuccessModal}
                title="Account verified"
                subtitle="Successfully"
            />
            <Toast
                style={toast.style}
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                fadeAnim={toast.fadeAnim}
                buttons={toast.buttons}
                onHide={toast.hide}
            />
        </SafeAreaView>
    )
}

export default OtpAuth