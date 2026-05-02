import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../Navigation/type';
import { useAuth } from '../Auth/AuthContext';

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  image: any;
  title: string;
  description: string;
}

const OnBoardingFrist = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'OnBoardingFrist'>>();
  const { setHasCompletedOnboarding } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const onBoardData = route.params?.onBoardData || [];
  const onBoardType = route.params?.onBoardType || 'USER';

  const handleNext = async () => {
    if (currentIndex < onBoardData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      // Mark onboarding as completed
      await setHasCompletedOnboarding(true);

      // Navigate to sign in with role
      (navigation as any).replace("SignIn", {
        type: onBoardType
      });
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as completed even if skipped
    await setHasCompletedOnboarding(true);
    (navigation as any).replace("SignIn", {
      type: onBoardType
    });
  };

  const onScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== currentIndex) {
      setCurrentIndex(slideIndex);
    }
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={{ width }} className='flex-1'>
      <View className='w-full flex-1 items-center justify-center'>
        <Image
          source={item.image}
          style={{ width: width, height: 550 }}
          resizeMode='contain'
        />
      </View>

      <View className='px-6 pb-4'>
        <Text className='text-3xl font-bold text-gray-dark text-center mb-4'>
          {item.title}
        </Text>

        <Text className='text-base text-gray-medium text-center leading-6'>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {currentIndex !== onBoardData.length - 1 && (
        <TouchableOpacity
          onPress={handleSkip}
          className='absolute top-16 right-6 z-10'
          activeOpacity={0.7}
        >
          <Text className='text-gray-medium text-base'>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={onBoardData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      <View className='px-6 pb-8'>
        <View className='flex-row justify-center mb-8'>
          {onBoardData.map((_: any, index: number) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-gray-300 w-2'
                }`}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className='bg-primary py-5 rounded-2xl'
          activeOpacity={0.8}
        >
          <Text className='text-white text-center text-lg font-bold'>
            {currentIndex === onBoardData.length - 1 ? 'GET STARTED' : 'NEXT'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnBoardingFrist;