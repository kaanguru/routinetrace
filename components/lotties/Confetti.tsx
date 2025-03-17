import LottieView from 'lottie-react-native';

export default function Confetti() {
  return (
    <LottieView
      autoPlay
      loop={false}
      speed={0.5}
      style={{
        width: 500,
        height: 640,
        alignSelf: 'center',
        zIndex: 10,
      }}
      source={require('~/assets/lottie/confetti-gi.json')}
      resizeMode="cover"
    />
  );
}
