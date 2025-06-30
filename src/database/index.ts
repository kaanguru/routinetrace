import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"; // Import as default export
import appSchema from "./schema"; // Importing the schema defined earlier

// Import model classes
import { Task } from "./models/Task";
import { ChecklistItem } from "./models/ChecklistItem";

// Define the adapter
const adapter = new SQLiteAdapter({
  schema: appSchema,
  // You might need to configure migrations here in a real app,
  // but for initial setup, we can assume schema version 1.
  // For production, you'd likely use migrations.
  // migrations: [],
  // promote: true, // Set to true for development if you want schema to be auto-created/updated
  jsi: true, // Use JSI binding for better performance
  // For Expo, you might need to specify the database location or use async storage.
  // The default behavior for expo is often to use SQLite in the app's data directory.
});

// Create the database instance
const database = new Database({
  adapter,
  modelClasses: [Task, ChecklistItem], // Register your models here
});

export { database };
