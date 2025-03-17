import LottieView from 'lottie-react-native';

export default function TiredOfWorking() {
  return (
    <LottieView
      autoPlay
      speed={0.75}
      style={{
        width: 360,
        height: 360,
        alignSelf: 'center',
      }}
      source={require('~/assets/lottie/yorgun.json')}
      resizeMode="cover"
    />
  );
}
