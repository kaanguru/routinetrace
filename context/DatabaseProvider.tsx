import React, { createContext, useContext, ReactNode } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "~/utils/supabase"; // Adjust the import path to your supabase client

type DatabaseContextType = {
  supabase: SupabaseClient;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <DatabaseContext.Provider value={{ supabase }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context.supabase;
};
