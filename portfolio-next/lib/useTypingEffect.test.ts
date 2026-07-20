import { renderHook, act } from "@testing-library/react";
import { useTypingEffect } from "./useTypingEffect";

describe("useTypingEffect", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("types out the first phrase one character at a time", () => {
    const { result } = renderHook(() => useTypingEffect(["Hey"], { typeSpeedMs: 10 }));
    expect(result.current.text).toBe("");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current.text).toBe("H");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current.text).toBe("He");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current.text).toBe("Hey");
  });

  it("stops on the last phrase without erasing and marks typingDone", () => {
    const { result } = renderHook(() =>
      useTypingEffect(["Hi"], { typeSpeedMs: 10, pauseMs: 1100 })
    );
    act(() => vi.advanceTimersByTime(10));
    act(() => vi.advanceTimersByTime(10));
    expect(result.current.text).toBe("Hi");
    expect(result.current.done).toBe(true);

    // A single-phrase list never erases, even long after finishing.
    act(() => vi.advanceTimersByTime(1100 + 100));
    expect(result.current.text).toBe("Hi");
    expect(result.current.done).toBe(true);
  });

  it("erases the current phrase after the pause when more phrases remain", () => {
    const { result } = renderHook(() =>
      useTypingEffect(["Hi", "Yo"], {
        typeSpeedMs: 10,
        pauseMs: 1100,
        eraseSpeedMs: [30, 30],
        eraseDelayMs: 320,
      })
    );

    // Type out "Hi"
    act(() => vi.advanceTimersByTime(10));
    act(() => vi.advanceTimersByTime(10));
    expect(result.current.text).toBe("Hi");

    // Wait for the pause before erasing starts
    act(() => vi.advanceTimersByTime(1100));
    expect(result.current.text).toBe("Hi");

    // Erase one character
    act(() => vi.advanceTimersByTime(30));
    expect(result.current.text).toBe("H");
    act(() => vi.advanceTimersByTime(30));
    expect(result.current.text).toBe("");

    // Wait for the delay before typing the next phrase begins
    act(() => vi.advanceTimersByTime(319));
    expect(result.current.text).toBe("");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.text).toBe("");

    // Types the next phrase from scratch
    act(() => vi.advanceTimersByTime(10));
    expect(result.current.text).toBe("Y");
    act(() => vi.advanceTimersByTime(10));
    expect(result.current.text).toBe("Yo");
    expect(result.current.done).toBe(true);
  });
});
