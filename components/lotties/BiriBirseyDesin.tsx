import LottieView from "lottie-react-native";

export default function BiriBirseyDesin() {
  return (
    <LottieView
      autoPlay
      style={{
        width: 480,
        height: 480,
        alignSelf: "center",
      }}
      source={require("~/assets/lottie/biri-birsey-desin.json")}
      resizeMode="cover"
    />
  );
}
