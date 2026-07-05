import { renderHook, act } from "@testing-library/react";
import { useTiltHover } from "./useTiltHover";

describe("useTiltHover", () => {
  it("resets to a flat transform on mouse leave", () => {
    const { result } = renderHook(() => useTiltHover(12));
    act(() => result.current.onMouseLeave());
    expect(result.current.style.transform).toBe(
      "perspective(800px) rotateX(0deg) rotateY(0deg)"
    );
  });

  it("computes a tilt from a mouse move within the element bounds", () => {
    const { result } = renderHook(() => useTiltHover(12));
    const target = {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 100 }),
    } as unknown as HTMLDivElement;
    act(() =>
      result.current.onMouseMove({
        clientX: 200,
        clientY: 0,
        currentTarget: target,
      } as unknown as React.MouseEvent)
    );
    // pointer at top-right corner -> full positive rotateY, full negative rotateX
    expect(result.current.style.transform).toBe(
      "perspective(800px) rotateX(12deg) rotateY(12deg)"
    );
  });
});
