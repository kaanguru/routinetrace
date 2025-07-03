/* eslint-disable @typescript-eslint/no-unused-vars */
// Import necessary modules
import {
  configureSyncedSupabase,
  syncedSupabase,
} from "@legendapp/state/sync-plugins/supabase";
import { configureObservableSync } from "@legendapp/state/sync";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js"; // Keep this import if it's used elsewhere or needed for context
import { faker } from "@faker-js/faker";
import { configurePersistence } from "../legendStateConfig"; // Import the function to test
import { tasks$, healthAndHappiness$, checklistItems$ } from "../observables"; // Assuming observables.ts is in the same directory

// Mock Supabase client
const mockSupabaseClient = {
  // Mock necessary Supabase client methods if needed for more complex tests
};

// Mock @legendapp/state/sync-plugins/supabase
jest.mock("@legendapp/state/sync-plugins/supabase", () => ({
  configureSyncedSupabase: jest.fn(),
  syncedSupabase: jest.fn(), // This mock is for the usage in observables.ts, not for testing config itself
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

// Mock observablePersistAsyncStorage and configureObservableSync
jest.mock("@legendapp/state/persist-plugins/async-storage", () => ({
  observablePersistAsyncStorage: jest.fn(),
}));
jest.mock("@legendapp/state/sync", () => ({
  configureObservableSync: jest.fn(),
}));

// Type assertion for mocks
const mockConfigureSyncedSupabase = configureSyncedSupabase as jest.Mock;
const mockSyncedSupabase = syncedSupabase as jest.Mock;
// ESLint Fix 1: Insert newline and space before this line
const mockObservablePersistAsyncStorage =
  observablePersistAsyncStorage as jest.Mock;
const mockConfigureObservableSync = configureObservableSync as jest.Mock;

// ESLint Fix 2: Modify comment line
const mockAsyncStoragePluginInstance = {
  /* mock plugin instance */
};

// ESLint Fix 3: Modify usage of mockAsyncStoragePluginInstance
mockObservablePersistAsyncStorage.mockReturnValue(
  mockAsyncStoragePluginInstance,
);

describe("observables", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock faker to return a predictable value
    (faker.string as any).uuid = jest.fn().mockReturnValue("mock-uuid");

    // Mock the return value of observablePersistAsyncStorage
    mockObservablePersistAsyncStorage.mockReturnValue(
      mockAsyncStoragePluginInstance,
    );
  });

  // Test for persistence configuration (AsyncStorage part)
  test("should configure persistence with AsyncStorage", () => {
    // Call the function that sets up persistence
    configurePersistence();

    // Assert that configureObservableSync was called with the correct persistence plugin
    expect(mockConfigureObservableSync).toHaveBeenCalledTimes(1);
    expect(mockConfigureObservableSync).toHaveBeenCalledWith({
      persist: {
        plugin: mockAsyncStoragePluginInstance, // Check if the mocked plugin instance is passed
        retrySync: true,
      },
    });

    // Assert that observablePersistAsyncStorage was called with the AsyncStorage mock
    expect(mockObservablePersistAsyncStorage).toHaveBeenCalledTimes(1);
    expect(mockObservablePersistAsyncStorage).toHaveBeenCalledWith({
      AsyncStorage: AsyncStorage, // Ensure the mock AsyncStorage is passed
    });
  });

  // Test for Supabase sync configuration
  test("should configure syncedSupabase with generateId", () => {
    // Ensure persistence is configured first, as configurePersistence also sets up syncedSupabase
    configurePersistence();

    // Assert that configureSyncedSupabase was called with generateId
    expect(mockConfigureSyncedSupabase).toHaveBeenCalledTimes(1);
    expect(mockConfigureSyncedSupabase).toHaveBeenCalledWith({
      generateId: expect.any(Function), // Check if it's called with a function
    });

    // Verify that the generateId function passed is indeed our mocked uuidv4
    const configArg = mockConfigureSyncedSupabase.mock.calls[0][0];
    expect(configArg.generateId()).toBe("mock-uuid"); // Check if the provided function generates the mock value
  });

  // Test for observable initialization
  test("should initialize observables with correct syncedSupabase configurations", () => {
    // Ensure configurePersistence is called to set up the sync plugins first.
    configurePersistence();

    // Check if syncedSupabase was called for each observable
    expect(mockSyncedSupabase).toHaveBeenCalledTimes(3);

    // Check configuration for tasks$
    expect(mockSyncedSupabase).toHaveBeenCalledWith({
      supabase: mockSupabaseClient,
      collection: "tasks",
    });

    // Check configuration for healthAndHappiness$
    expect(mockSyncedSupabase).toHaveBeenCalledWith({
      supabase: mockSupabaseClient,
      collection: "health_and_happiness",
    });

    // Check configuration for checklistItems$
    expect(mockSyncedSupabase).toHaveBeenCalledWith({
      supabase: mockSupabaseClient,
      collection: "checklistitems",
    });
  });
});
