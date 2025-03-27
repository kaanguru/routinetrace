import Reactotron, {
  asyncStorage,
  openInEditor,
  trackGlobalErrors,
} from "reactotron-react-native";

Reactotron.configure()
  .useReactNative()
  .use(asyncStorage())
  .use(openInEditor())
  .use(trackGlobalErrors())
  .connect();
