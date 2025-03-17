import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export function useSoundSettings() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('soundEnabled').then((value) => {
      if (value !== null) setIsSoundEnabled(JSON.parse(value));
    });
  }, []);

  const toggleSound = async () => {
    const newValue = !isSoundEnabled;
    await AsyncStorage.setItem('soundEnabled', JSON.stringify(newValue));
    setIsSoundEnabled(newValue);
  };

  return { isSoundEnabled, toggleSound };
}
