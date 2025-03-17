import LottieView from 'lottie-react-native';

export default function TuneUp() {
  return (
    <LottieView
      autoPlay
      speed={0.66}
      style={{
        width: 240,
        height: 240,
        alignSelf: 'center',
      }}
      source={require('~/assets/lottie/tuneup.json')}
      resizeMode="cover"
    />
  );
}
