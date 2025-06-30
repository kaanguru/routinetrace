import { appSchema, tableSchema } from "@nozbe/watermelondb";

const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "tasks",
      columns: [
        { name: "id", type: "number" }, // isPrimaryKey removed from column definition as per error
        { name: "supabase_id", type: "string", isIndexed: true },
        { name: "created_at", type: "string" },
        { name: "title", type: "string" },
        { name: "notes", type: "string", isOptional: true },
        { name: "updated_at", type: "string", isOptional: true },
        { name: "is_complete", type: "boolean" },
        { name: "position", type: "number", isOptional: true },
        { name: "repeat_on_wk", type: "string", isOptional: true },
        { name: "repeat_frequency", type: "number", isOptional: true },
        { name: "repeat_period", type: "string", isOptional: true },
        { name: "user_id", type: "string" },
      ],
      // idColumn: "id", // Removed as it's not recognized by the types
    }),
    tableSchema({
      name: "checklistitems",
      columns: [
        { name: "id", type: "number" }, // isPrimaryKey removed from column definition as per error
        { name: "supabase_id", type: "string", isIndexed: true },
        { name: "created_at", type: "string" },
        { name: "content", type: "string" },
        { name: "updated_at", type: "string", isOptional: true },
        { name: "is_complete", type: "boolean" },
        { name: "task_id", type: "number" },
      ],
      // idColumn: "id", // Removed as it's not recognized by the types
    }),
  ],
});

export default schema;
