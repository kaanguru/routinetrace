import { calculateRepeatText } from "../calculateRepeatText";

describe("calculateRepeatText", () => {
  it("should return an empty string if repeatPeriod is empty", () => {
    expect(calculateRepeatText("", 1)).toBe("");
  });

  it("should return the correct text for daily repeat", () => {
    expect(calculateRepeatText("Daily", 1)).toBe("1 day");
    expect(calculateRepeatText("Daily", 2)).toBe("2 days");
  });

  it("should return the correct text for weekly repeat", () => {
    expect(calculateRepeatText("Weekly", 1)).toBe("1 week");
    expect(calculateRepeatText("Weekly", 2)).toBe("2 weeks");
  });

  it("should return the correct text for monthly repeat", () => {
    expect(calculateRepeatText("Monthly", 1)).toBe("1 month");
    expect(calculateRepeatText("Monthly", 2)).toBe("2 months");
  });

  it("should return the correct text for yearly repeat", () => {
    expect(calculateRepeatText("Yearly", 1)).toBe("1 year");
    expect(calculateRepeatText("Yearly", 2)).toBe("2 years");
  });
});
