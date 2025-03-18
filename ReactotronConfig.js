import Reactotron, {
  asyncStorage,
  openInEditor,
  trackGlobalErrors,
} from "reactotron-react-native";

Reactotron.configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(asyncStorage())
  .use(openInEditor())
  .use(trackGlobalErrors())
  .connect(); // let's connect!
