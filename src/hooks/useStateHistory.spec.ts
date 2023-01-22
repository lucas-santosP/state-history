import { renderHook, act } from "@testing-library/react";

import { useStateHistory } from "./useStateHistory";

describe("useStateHistory", () => {
  it("should add state", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());
    act(() => result.current.addState([0, 1]));
    act(() => result.current.addState([2, 2]));

    expect(result.current.states).toEqual([
      [2, 2],
      [0, 1],
    ]);
  });

  it("should override next states when adding new state after a undo", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());
    act(() =>
      result.current.setStates([
        [0, 1],
        [1, 1],
        [2, 2],
      ])
    );
    act(() => result.current.previousState());
    act(() => result.current.addState([3, 3]));

    expect(result.current.states).toEqual([
      [3, 3],
      [1, 1],
      [2, 2],
    ]);
  });

  it("should set state", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());
    act(() =>
      result.current.setStates([
        [0, 0],
        [1, 1],
      ])
    );

    expect(result.current.states).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it("should throws when setting state with invalid current index", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());

    expect(() =>
      result.current.setStates(
        [
          [0, 0],
          [1, 1],
        ],
        2
      )
    ).toThrowError(new Error("Invalid combination of index and new states."));
  });

  it("should delete state", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());
    act(() => result.current.addState([0, 0]));
    act(() => result.current.deleteState(0));

    expect(result.current.states).toEqual([]);
  });

  it("should undo a state", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());
    act(() => result.current.addState([0, 0]));
    act(() => result.current.addState([1, 1]));
    act(() => result.current.addState([2, 2]));
    act(() => result.current.previousState());

    expect(result.current.states[result.current.currentIndex]).toEqual([1, 1]);
  });

  it("should throws when there is no state to undo", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());

    expect(() => result.current.previousState()).toThrowError(
      new Error("There is not previous state.")
    );
  });

  it("should redo a state", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());
    act(() => result.current.addState([0, 0]));
    act(() => result.current.addState([1, 1]));
    act(() => result.current.addState([2, 2]));
    act(() => result.current.previousState());
    act(() => result.current.previousState());
    act(() => result.current.nextState());

    expect(result.current.states[result.current.currentIndex]).toEqual([1, 1]);
  });

  it("should throws when there is no state to redo", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());

    expect(() => result.current.nextState()).toThrowError(new Error("There is not next state."));
  });

  it("should set new current index", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());
    act(() => result.current.addState([0, 0]));
    act(() => result.current.addState([0, 0]));
    act(() => result.current.setCurrentIndex(1));

    expect(result.current.currentIndex).toEqual(1);
  });

  it("should throws when setting a invalid current index", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());
    act(() => result.current.addState([0, 0]));

    expect(() => result.current.setCurrentIndex(2)).toThrowError(new Error("Invalid state index."));
  });

  it("should clear states and index", async () => {
    const { result } = renderHook(() => useStateHistory<[number, number]>());
    act(() => result.current.addState([0, 0]));
    act(() => result.current.addState([1, 1]));
    act(() => result.current.setCurrentIndex(1));
    act(() => result.current.clearHistory());

    expect(result.current.currentIndex).toEqual(0);
    expect(result.current.states).toEqual([]);
  });
});
