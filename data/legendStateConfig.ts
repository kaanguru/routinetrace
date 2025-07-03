import { configureObservableSync } from "@legendapp/state/sync";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureSyncedSupabase } from "@legendapp/state/sync-plugins/supabase";

export function configurePersistence(): void {
  configureObservableSync({
    persist: {
      plugin: observablePersistAsyncStorage({
        AsyncStorage: AsyncStorage,
      }),
      retrySync: true,
    },
  });

  configureSyncedSupabase({
    generateId: () => String(Date.now()),
  });
}
