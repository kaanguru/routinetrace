## Database Types

- Use the generated types provided by Supabase shorthands for accessing tables and enums.
  like:

```ts
import { Tables } from "~/database.types";
const task: Tables<"tasks"> = {
  id: 1,
  title: "Task 1",
  notes: "Description 1",
  is_complete: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
```
