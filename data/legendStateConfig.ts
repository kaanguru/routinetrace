import { configureSynced } from "@legendapp/state/sync";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function configurePersistence(): void {
  configureSynced({
    persist: {
      plugin: observablePersistAsyncStorage({
        AsyncStorage: AsyncStorage,
      }),
      retrySync: true,
    },
  });
}
