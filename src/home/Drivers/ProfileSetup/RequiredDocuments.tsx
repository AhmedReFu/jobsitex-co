import { IMAGE_UPLOAD, IPA_BASE } from '@env'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Toast, useToast } from '../../../Components/useToost'
import { AuthStackParamList } from '../../../Navigation/type'

const API_BASE_URL = IPA_BASE

type UploadKey = 'cdl' | 'insurance' | 'dot' | 'truck'

type ImageItem = {
  uri: string
  name: string
  type: string
}

const uploadOptions: {
  key: UploadKey
  label: string
  title: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
}[] = [
    {
      key: 'cdl',
      label: 'CDL\nLicense',
      title: 'Upload CDL License Photo',
      subtitle: 'Clear image of your CDL license',
      icon: 'card-outline',
    },
    {
      key: 'insurance',
      label: 'Insurance\nPhoto',
      title: 'Upload Insurance Photo',
      subtitle: 'Clear image of insurance paper/photo',
      icon: 'shield-checkmark-outline',
    },
    {
      key: 'dot',
      label: 'DOT\nPhoto',
      title: 'Upload DOT Photo',
      subtitle: 'Clear image showing DOT info',
      icon: 'document-text-outline',
    },
    {
      key: 'truck',
      label: 'Truck\nPhoto',
      title: 'Upload Truck Photo',
      subtitle: 'Clear photo of your truck',
      icon: 'car-sport-outline',
    },
  ]

const RequiredDocuments = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const route = useRoute<any>()
  const toast = useToast()

  const accessToken = route?.params?.accessToken || route?.params?.token || null

  const [selected, setSelected] = useState<UploadKey>('cdl')
  const [imagesa, setImagesa] = useState<Record<UploadKey, ImageItem | null>>({
    cdl: null,
    insurance: null,
    dot: null,
    truck: null,
  })
  const [submitting, setSubmitting] = useState(false)

  const selectedOption = useMemo(
    () => uploadOptions.find((item) => item.key === selected)!,
    [selected]
  )

  const uploadedCount = useMemo(() => {
    return Object.values(imagesa).filter(Boolean).length
  }, [imagesa])

  const allUploaded = useMemo(() => {
    return uploadOptions.every((item) => !!imagesa[item.key])
  }, [imagesa])

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Gallery permission allow koro.')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      })

      if (result.canceled) return

      const asset = result.assets[0]
      const fileName =
        asset.fileName || `${selected}-${Date.now()}.jpg`

      setImagesa((prev) => ({
        ...prev,
        [selected]: {
          uri: asset.uri,
          name: fileName,
          type: asset.mimeType || 'image/jpeg',
        },
      }))
    } catch (error) {
      console.log('Image pick error:', error)
      toast.show({
        message: 'Image select korte problem hoise',
        type: 'error',
        style: 'top',
      })
    }
  }

  const removeImage = (key: UploadKey) => {
    setImagesa((prev) => ({
      ...prev,
      [key]: null,
    }))
  }

  const handleSubmit = async () => {
    if (!allUploaded) {
      toast.show({
        message: '4 ta image upload kora lagbe',
        type: 'error',
        style: 'top',
      })
      return
    }

    try {
      setSubmitting(true)

      const token = accessToken || (await AsyncStorage.getItem('vToken'))

      if (!token) {
        toast.show({
          message: 'Access token paoa jay nai',
          type: 'error',
          style: 'top',
        })
        return
      }

      const formData = new FormData()

      uploadOptions.forEach((item) => {
        const file = imagesa[item.key]
        if (file) {
          formData.append('images', {
            uri: file.uri,
            name: file.name,
            type: file.type,
          } as any)
        }
      })

      const res = await axios.post(`${API_BASE_URL}${IMAGE_UPLOAD}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 20000,
      })

      const data = res?.data
      console.log('Upload response:', data)

      if (data?.success === true) {
        toast.show({
          message: data?.message || 'Images uploaded successfully',
          type: 'success',
          style: 'top',
        })

        navigation.navigate('SignIn')
      } else {
        toast.show({
          message: data?.message || 'Upload failed',
          type: 'error',
          style: 'top',
        })
      }
    } catch (error: any) {
      console.log('Upload failed:', error)
      console.log('Upload server response:', error?.response?.data)

      toast.show({
        message:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
        type: 'error',
        style: 'top',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='flex-row items-center px-5 py-2 bg-gray-50'>
        <TouchableOpacity onPress={() => navigation.goBack()} className='mr-4'>
          <Ionicons name='arrow-back' size={28} color='#000' />
        </TouchableOpacity>
        <Text className='text-2xl font-black text-gray-900'>Profile Setup</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className='px-5 pt-5'>
          <Text className='text-2xl font-black text-gray-900 mb-2'>
            Required Images
          </Text>
          <Text className='text-gray-500 text-base mb-6 leading-5'>
            4 ta clear image upload koro. Submit korar somoy sob image ekshathe verify
            er jonno send hobe.
          </Text>

          <Text className='text-lg font-bold text-gray-900 mb-4'>
            Select image type
          </Text>

          <View className='flex-row flex-wrap justify-between mb-6'>
            {uploadOptions.map((item) => {
              const active = selected === item.key
              const hasImage = !!imagesa[item.key]

              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setSelected(item.key)}
                  activeOpacity={0.85}
                  className={`w-[48%] rounded-2xl p-4 mb-3 border-2 ${active ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                    }`}
                >
                  <View className='flex-row items-start justify-between'>
                    <View
                      className={`w-12 h-12 rounded-2xl items-center justify-center ${active ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                    >
                      <Ionicons
                        name={item.icon}
                        size={22}
                        color={active ? '#16A34A' : '#9CA3AF'}
                      />
                    </View>

                    {hasImage ? (
                      <View className='w-6 h-6 rounded-full bg-green-500 items-center justify-center'>
                        <Ionicons name='checkmark' size={16} color='white' />
                      </View>
                    ) : null}
                  </View>

                  <Text
                    className={`mt-3 text-sm font-bold ${active ? 'text-green-700' : 'text-gray-900'
                      }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          <View className='items-center mb-6'>
            <View style={{ position: 'relative' }}>
              <View
                className='w-56 h-56 rounded-[28px] bg-white items-center justify-center overflow-hidden'
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                {imagesa[selected]?.uri ? (
                  <Image
                    source={{ uri: imagesa[selected]?.uri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode='cover'
                  />
                ) : (
                  <View className='items-center px-6'>
                    <Ionicons name={selectedOption.icon} size={60} color='#D1D5DB' />
                    <Text className='text-gray-400 text-center mt-3 font-medium'>
                      No image selected
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={{ position: 'absolute', right: 6, bottom: 6 }}
                activeOpacity={0.85}
                onPress={pickImage}
              >
                <View
                  className='w-14 h-14 rounded-full bg-green-500 items-center justify-center border-4 border-white'
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Ionicons name='image-outline' size={22} color='white' />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Text className='text-xl font-bold text-center text-gray-900 mb-2'>
            {selectedOption.title}
          </Text>

          <Text className='text-center text-gray-500 text-base mb-5 leading-5'>
            {selectedOption.subtitle}
          </Text>

          <View className='flex-row gap-3 mb-6'>
            <TouchableOpacity
              className='flex-1 py-4 rounded-2xl border border-gray-300 items-center justify-center bg-white flex-row'
              activeOpacity={0.8}
              onPress={pickImage}
            >
              <Ionicons name='cloud-upload-outline' size={20} color='#374151' />
              <Text className='text-gray-700 ml-2 font-bold'>
                {imagesa[selected] ? 'Replace Image' : 'Choose Image'}
              </Text>
            </TouchableOpacity>

            {imagesa[selected] ? (
              <TouchableOpacity
                className='px-5 py-4 rounded-2xl bg-red-50 items-center justify-center border border-red-200'
                activeOpacity={0.8}
                onPress={() => removeImage(selected)}
              >
                <Ionicons name='trash-outline' size={20} color='#DC2626' />
              </TouchableOpacity>
            ) : null}
          </View>

          <View className='bg-white rounded-3xl p-4 mb-6 border border-gray-100'>
            <View className='flex-row items-center justify-between mb-3'>
              <Text className='text-lg font-black text-gray-900'>Upload Progress</Text>
              <Text className='text-sm font-bold text-green-600'>
                {uploadedCount}/4 Completed
              </Text>
            </View>

            {uploadOptions.map((item) => {
              const done = !!imagesa[item.key]
              return (
                <View
                  key={item.key}
                  className='flex-row items-center justify-between py-3 border-b border-gray-100'
                >
                  <View className='flex-row items-center flex-1 pr-3'>
                    <View
                      className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${done ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                    >
                      <Ionicons
                        name={done ? 'checkmark' : item.icon}
                        size={18}
                        color={done ? '#16A34A' : '#9CA3AF'}
                      />
                    </View>

                    <Text className='text-gray-900 font-semibold'>
                      {item.title}
                    </Text>
                  </View>

                  <Text
                    className={`text-xs font-bold ${done ? 'text-green-600' : 'text-gray-400'
                      }`}
                  >
                    {done ? 'READY' : 'PENDING'}
                  </Text>
                </View>
              )
            })}
          </View>

          <View className='mb-6 p-4 rounded-2xl flex-row' style={{ backgroundColor: '#FFF4E6' }}>
            <View className='w-6 h-6 rounded-full bg-orange-400 items-center justify-center mr-3 mt-0.5'>
              <Ionicons name='information' size={16} color='white' />
            </View>
            <Text className='text-orange-700 flex-1 text-sm leading-5'>
              Secure Transmission: Your data is encrypted using
              256-bit SSLprotection. Verification usuaIly ta kes 2-4
              hours.
            </Text>
          </View>

          <TouchableOpacity
            className={`rounded-2xl py-5 items-center flex-row justify-center ${allUploaded && !submitting ? 'bg-green-500' : 'bg-gray-300'
              }`}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={!allUploaded || submitting}
          >
            {submitting ? (
              <ActivityIndicator size='small' color='white' />
            ) : (
              <>
                <Text className='text-white font-bold text-lg mr-2'>
                  SUBMIT FOR VERIFICATION
                </Text>
                <Ionicons name='arrow-forward' size={20} color='white' />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

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

export default RequiredDocuments