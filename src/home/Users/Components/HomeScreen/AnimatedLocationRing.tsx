import React, { useRef, useEffect } from 'react'
import { Animated, Easing, TouchableOpacity, Image, View } from 'react-native'
import { Images } from '../../../../constants'
import { useUser } from '../../../../Auth/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AnimatedLocationRingProps {
  onPress: () => void
}

const AnimatedLocationRing: React.FC<AnimatedLocationRingProps> = ({ onPress }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
  }, [])

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const { getProfileImage } = useUser();
  const [profileImage, setProfileImage] = React.useState<string | null>(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      const imageUri = await getProfileImage();
      setProfileImage(imageUri);
    };

    loadProfileImage();
  }, []);

  return (
    <View className='relative w-[72px] h-[72px]'>
      <Animated.View
        style={{
          transform: [{ rotate }],
        }}
        className='absolute inset-0 border-2 border-dashed border-white rounded-full'
      />
      <TouchableOpacity onPress={onPress} className='absolute inset-0 items-center justify-center'>
        <Image source={profileImage ? { uri: profileImage } : Images.MyProfile} className='w-16 h-16 rounded-full' />
      </TouchableOpacity>
    </View>
  )
}

export default AnimatedLocationRing