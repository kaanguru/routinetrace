# **4. Technology Stack**

This plan involves maintaining the core stack while introducing a new, specialized data layer.

**Technology to be Maintained:**

|Category|Current Technology|
|---|---|
|**Language**|TypeScript|
|**Framework**|React Native (Expo)|
|**UI Library**|React Native Elements|
|**Routing**|Expo Router|
|**Backend**|Supabase|

**New Technology Additions:**

|Technology|Purpose|
|---|---|
|**`@legendapp/state`**|Core state management and reactivity.|
|**`@legendapp/state/sync/supabase`**|Supabase sync plugin for bi-directional data flow.|
|**`@legendapp/state/persist/async-storage`**|Persistence plugin for storing data offline in React Native.|
