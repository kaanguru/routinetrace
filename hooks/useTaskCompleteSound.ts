import { Audio } from 'expo-av';
import { useEffect, useCallback, useState } from 'react';

import { useSoundSettings } from './useSoundSettings';

const soundSources = [
  require('../assets/sound/confetti/sfx.mp3'),
  require('../assets/sound/confetti/soft.mp3'),
  require('../assets/sound/confetti/wind.mp3'),
];

export default function useTaskCompleteSound() {
  const [sound, setSound] = useState<Audio.Sound>();
  const { isSoundEnabled } = useSoundSettings();

  const playSound = useCallback(async () => {
    try {
      if (!isSoundEnabled) return;

      const randomIndex = Math.floor(Math.random() * soundSources.length);
      const { sound: newSound } = await Audio.Sound.createAsync(soundSources[randomIndex]);

      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isSoundEnabled]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return { playSound };
}
