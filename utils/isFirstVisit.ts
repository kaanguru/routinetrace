import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, router } from 'expo-router';

const FIRST_VISIT_KEY = '@gorevizi:first_visit';

export const isFirstVisit = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(FIRST_VISIT_KEY);
    if (value === null) {
      // If no value is stored, it's the first visit
      await AsyncStorage.setItem(FIRST_VISIT_KEY, 'false');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking first visit:', error);
    return false;
  }
};

export const resetFirstVisit = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FIRST_VISIT_KEY);
    await new Promise((resolve) => setTimeout(resolve, 200));
    router.replace('/(onboarding)/splash' as Href);
  } catch (error) {
    console.error('Error resetting first visit:', error);
  }
};
