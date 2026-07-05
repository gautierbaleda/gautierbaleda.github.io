import { renderHook, act } from "@testing-library/react";
import { useTypingEffect } from "./useTypingEffect";

describe("useTypingEffect", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("types out the first word one character at a time", () => {
    const { result } = renderHook(() => useTypingEffect(["Hey"], { typeSpeedMs: 10 }));
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe("H");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe("He");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current).toBe("Hey");
  });
});
