# **2. Core Architectural Principles**

- **Functional Programming:** We will strictly use pure functions and ensure immutability throughout the new data layer.
    
- **Error Handling:** The `Neverthrow` library (`Result`, `ResultAsync`) is mandatory for handling all operations that can fail, ensuring predictable error management.
    
- **UI Consistency:** All UI components will continue to be built using React Native Elements (`@rneui/themed`).
    
- **Type Safety:** We will exclusively use the Supabase generated types from `database.types.ts` for all data interactions.
    
- **Stability of `utils/supabase.ts`:** This core file will not be modified.
    
