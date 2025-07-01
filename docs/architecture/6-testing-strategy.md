# **6. Testing Strategy**

- **Unit Tests (Jest)**: Each custom hook and complex utility function will be unit tested using Jest to verify its business logic.
    
- **Integration Tests (Jest)**: We will test the interaction between the Legend-State data layer and the application, mocking the Supabase client to ensure the sync engine behaves correctly.
    
- **End-to-End Tests (Maestro)**: We will use Maestro to create automated flows that simulate real user scenarios, including going offline, making changes, and verifying a successful sync upon reconnection.
    
- **Manual Testing**: A critical part of the "Definition of Done" for each related story will be a manual test case in airplane mode to guarantee a flawless offline experience.
    
