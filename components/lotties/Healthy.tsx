import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface HealthyProps {
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Healthy({ height = 530, width = 199, style }: Readonly<HealthyProps>) {
  return (
    <LottieView
      autoPlay
      loop={true}
      speed={0.5}
      style={[
        {
          width: width,
          height: height,
          alignSelf: 'center',
          zIndex: 10,
        },
        style,
      ]}
      source={require('~/assets/lottie/healthy.json')}
      resizeMode="cover"
    />
  );
}
