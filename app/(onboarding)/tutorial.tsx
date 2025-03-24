import Background from "@/components/Background";
import { Button, Text } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { Video, ResizeMode } from "expo-av";
import { Href, useRouter } from "expo-router";
import { useState, useRef } from "react";
import { View, Dimensions } from "react-native";

interface TutorialItem {
  id: number;
  image: any;
  title: string;
}

const tutorials: TutorialItem[] = [
  {
    id: 1,
    image: require("../../assets/tut/tut-create.webm"),
    title: "Create a new task",
  },
  {
    id: 2,
    image: require("../../assets/tut/tut-create-weekly.webm"),
    title: "Create a new weekly task",
  },
  {
    id: 3,
    image: require("../../assets/tut/tut-create-level.webm"),
    title: "Track your progress",
  },
];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function TutorialScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flashListRef = useRef<FlashList<TutorialItem>>(null);

  // Specify type for renderItem
  const renderItem = ({ item }: Readonly<{ item: TutorialItem }>) => (
    <View
      style={{
        width: SCREEN_WIDTH - 20,
        height: SCREEN_HEIGHT - 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Video
        source={item.image}
        style={{ width: SCREEN_WIDTH, height: 700 }}
        isLooping
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isMuted
        rate={0.5}
      />
      <Text
        h4
        style={{
          marginTop: -160,
          color: "#ff006e",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {item.title}
      </Text>
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
      router.replace("/(onboarding)/start" as Href);
    }
  };
  const styles = {
    dot: {
      margin: 4,
      height: 8,
      width: 8,
      borderRadius: 4,
    },
    activeDot: {
      backgroundColor: "#ff006e", // Primary color
    },
    inactiveDot: {
      backgroundColor: "#00173D", // Black
    },
    inactiveDotDark: {
      backgroundColor: "#FFE499", // White
    },
  };
  return (
    <Background>
      <View style={{ flex: 1, justifyContent: "space-around" }}>
        <FlashList
          ref={flashListRef}
          data={tutorials}
          renderItem={renderItem}
          estimatedItemSize={SCREEN_WIDTH - 5}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / SCREEN_WIDTH
            );
            setCurrentIndex(newIndex);
          }}
        />
        <View
          id="paginator"
          style={{ flexDirection: "row", marginInline: "auto", maxHeight: 20 }}
        >
          {tutorials.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex
                  ? styles.activeDot
                  : styles.inactiveDotDark,
              ]}
            />
          ))}
        </View>
        <Button
          onPress={handleContinue}
          title={
            currentIndex === tutorials.length - 1 ? "Get Started" : "Continue"
          }
        />
      </View>
    </Background>
  );
}
