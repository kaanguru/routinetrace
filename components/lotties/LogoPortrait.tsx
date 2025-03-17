import LottieView from 'lottie-react-native';
import { StyleProp, ViewStyle, Dimensions } from 'react-native';

interface LogoPortraitProps {
  scale?: number;
  style?: StyleProp<ViewStyle>;
}

export default function LogoPortrait({ scale = 0.3, style }: Readonly<LogoPortraitProps>) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <LottieView
      autoPlay
      loop={false}
      speed={0.5}
      style={[
        {
          width: windowWidth * scale,
          height: windowHeight * scale,
          alignSelf: 'center',
          zIndex: 10,
        },
        style,
      ]}
      source={require('~/assets/lottie/logo/logo-c-p.json')}
      resizeMode="cover"
    />
  );
}
