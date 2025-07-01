# **3. Integration Strategy**

- **Architectural Shift**: We are moving from a direct client-server model to a local-first architecture. The application's state on the device is the source of truth, which synchronizes with the backend when possible.
    
- **Data Layer Replacement**: **Legend-State** will replace the previously planned **TanStack Query** for all data fetching, caching, and state management. This provides a unified solution for both online and offline data operations.
    
- **UI Decoupling**: UI components will be decoupled from the data layer via custom hooks, making them simpler, more reusable, and easier to test.
    
