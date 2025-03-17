import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface CheckBoxProps {
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedCheckBox({
  height = 30,
  width = 30,
  style,
}: Readonly<CheckBoxProps>) {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    if (animation.current) {
      animation.current.play(60, 0);
    }
  }, []);

  return (
    <LottieView
      ref={animation}
      autoPlay={false}
      loop={false}
      speed={1.5}
      key="checkbox"
      style={[
        {
          width,
          height,
          alignSelf: 'center',
          zIndex: 10,
        },
        style,
      ]}
      source={require('~/assets/lottie/checkbox.json')}
      resizeMode="cover"
    />
  );
}
