import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext } from 'react';

interface SoundContextProps {
  isSoundEnabled: boolean;
  toggleSound: () => Promise<void>;
}

const SoundContext = createContext<SoundContextProps | undefined>(undefined);

export const SoundProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    const loadSoundSetting = async () => {
      try {
        const value = await AsyncStorage.getItem('soundEnabled');
        if (value !== null) {
          setIsSoundEnabled(JSON.parse(value));
        }
      } catch (e) {
        console.error('Error loading sound setting:', e);
      }
    };

    loadSoundSetting();
  }, []);

  const toggleSound = async () => {
    const newValue = !isSoundEnabled;
    try {
      await AsyncStorage.setItem('soundEnabled', JSON.stringify(newValue));
      setIsSoundEnabled(newValue);
    } catch (e) {
      console.error('Error saving sound setting:', e);
    }
  };

  return (
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};
