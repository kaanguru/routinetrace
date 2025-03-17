import { Button } from '@rneui/themed';
import { FlashList } from '@shopify/flash-list';
import { Video, ResizeMode } from 'expo-av';
import { Href, useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { View, Text, Dimensions } from 'react-native';

interface TutorialItem {
  id: number;
  image: any;
  title: string;
}

const tutorials: TutorialItem[] = [
  {
    id: 1,
    image: require('../../assets/tut/tut-create.webm'),
    title: 'Create a new task',
  },
  {
    id: 2,
    image: require('../../assets/tut/tut-create-weekly.webm'),
    title: 'Create a new weekly task',
  },
  {
    id: 3,
    image: require('../../assets/tut/tut-create-level.webm'),
    title: 'Track your progress',
  },
];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TutorialScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flashListRef = useRef<FlashList<TutorialItem>>(null);

  // Specify type for renderItem
  const renderItem = ({ item }: Readonly<{ item: TutorialItem }>) => (
    <View className="h-full items-center justify-evenly px-5" style={{ width: SCREEN_WIDTH }}>
      <Video
        source={item.image}
        style={{ width: SCREEN_WIDTH, height: 700 }}
        isLooping
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isMuted
        rate={0.5}
      />
      <Text className="text-navy-800 mb-2.5 text-2xl font-bold">{item.title}</Text>
    </View>
  );

  const handleContinue = () => {
    if (currentIndex < tutorials.length - 1) {
      flashListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(onboarding)/start' as Href);
    }
  };

  return (
    <View className="bg-background-light dark:bg-background-dark flex-1">
      <View className="flex-1">
        <FlashList
          ref={flashListRef}
          data={tutorials}
          renderItem={renderItem}
          estimatedItemSize={SCREEN_WIDTH}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(newIndex);
          }}
        />
      </View>

      <View className=" px-1 pb-1">
        <View id="paginator" className="mb-1 flex-row items-center justify-center">
          {tutorials.map((_, index) => (
            <View
              key={index}
              className={`m-1 h-2 w-2 rounded-full ${
                index === currentIndex
                  ? 'bg-background-primary'
                  : 'bg-background-dark dark:bg-background-light'
              }`}
            />
          ))}
        </View>
        <Button
          onPress={handleContinue}
          className="bg-background-light dark:bg-background-dark"
          title={currentIndex === tutorials.length - 1 ? 'Get Started' : 'Continue'}
        />
      </View>
    </View>
  );
}
