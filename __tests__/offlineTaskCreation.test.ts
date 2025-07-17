import { renderHook } from "@testing-library/react-hooks";
import { createTask, tasks$ } from "../data/observables";
import { TaskFormData, ExtendedTask } from "../types";

// Mock supabase
jest.mock("../utils/supabase", () => ({
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => ({ data: null, error: { message: "offline" } })),
      })),
    })),
  })),
}));

describe("Offline Task Creation", () => {
  it("should create a task offline and store it locally", async () => {
    const formData: TaskFormData = {
      title: "Test Task",
      notes: "Test Notes",
      repeatPeriod: "",
      repeatFrequency: 1,
      repeatOnWk: [],
      customStartDate: null,
      isCustomStartDateEnabled: false,
      checklistItems: [],
    };

    const result = await createTask(formData);

    // Check that the task was added to the local observable
    const tasks = tasks$("not-completed").get();
    const newTask = tasks.find((t) => t.title === "Test Task") as
      | ExtendedTask
      | undefined;
    expect(newTask).toBeDefined();
    if (newTask) {
      expect((newTask as ExtendedTask).pendingSync).toBe(true);
    }

    // Check that the returned task has a temporary ID and pendingSync flag
    expect(result.id).toBeDefined();
    expect((result as ExtendedTask).pendingSync).toBe(true);
  });
});
