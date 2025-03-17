import LottieView from 'lottie-react-native';

export default function WellDone() {
  return (
    <LottieView
      autoPlay
      style={{
        width: 480,
        height: 480,
        alignSelf: 'center',
      }}
      speed={0.8}
      source={require('~/assets/lottie/well-done.json')}
      resizeMode="cover"
    />
  );
}
