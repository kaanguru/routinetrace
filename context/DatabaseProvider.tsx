import React, { createContext, useContext, ReactNode } from "react";
import { database } from "~/database";

// Define the context type
interface DatabaseContextType {
  db: typeof database;
}

// Create the context
const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

// Create the provider component
export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  // The database instance is created when importing from src/database/index.ts

  return (
    <DatabaseContext.Provider value={{ db: database }}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook to use the database context
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context.db;
};
