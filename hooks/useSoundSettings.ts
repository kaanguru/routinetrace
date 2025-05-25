import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export function useSoundSettings() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const SOUND_ENABLED_KEY = "@gorevizi:soundEnabled";

  useEffect(() => {
    AsyncStorage.getItem(SOUND_ENABLED_KEY).then((value) => {
      if (value !== null) setIsSoundEnabled(JSON.parse(value));
    });
  }, []);

  const toggleSound = async () => {
    const newValue = !isSoundEnabled;
    await AsyncStorage.setItem(SOUND_ENABLED_KEY, JSON.stringify(newValue));
    setIsSoundEnabled(newValue);
  };

  return { isSoundEnabled, toggleSound };
}
