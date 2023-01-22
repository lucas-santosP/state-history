import React from "react";

export function useStateHistory<T>() {
  const [history, setHistory] = React.useState<{ states: Array<T>; currentIndex: number }>({
    currentIndex: 0,
    states: [],
  });

  function previousState() {
    const newIndex = history.currentIndex + 1;
    if (history.states.length - 1 >= newIndex) {
      setHistory((prev) => ({ ...prev, currentIndex: newIndex }));
    } else {
      throw new Error("There is not previous state.");
    }
  }

  function nextState() {
    const newIndex = history.currentIndex - 1;
    if (history.states.length && newIndex >= 0) {
      setHistory((prev) => ({ ...prev, currentIndex: newIndex }));
    } else {
      throw new Error("There is not next state.");
    }
  }

  function handleSetCurrentStateIndex(value: number) {
    if (value > history.states.length - 1) {
      throw new Error("Invalid state index.");
    }
    setHistory((prev) => ({ ...prev, currentIndex: value }));
  }

  function addState(newState: T) {
    if (history.currentIndex !== 0) {
      setHistory((prev) => {
        const newStates = prev.states.slice(prev.currentIndex, prev.states.length);
        return { states: [newState, ...newStates], currentIndex: 0 };
      });
    } else {
      setHistory((prev) => ({
        states: [newState, ...prev.states],
        currentIndex: 0,
      }));
    }
  }

  function deleteState(index: number) {
    setHistory((prev) => {
      const newStates = [...prev.states];
      newStates.splice(index, 1);
      return { ...prev, states: newStates };
    });
  }

  function handleSetStates(newStates: Array<T>, newIndex?: number) {
    const newStateIndex = newIndex !== undefined ? newIndex : history.currentIndex;
    if (newStates.length - 1 < newStateIndex) {
      throw new Error("Invalid combination of index and new states.");
    }

    setHistory({ states: newStates, currentIndex: newStateIndex });
  }

  function clearHistory() {
    setHistory({ currentIndex: 0, states: [] });
  }

  return {
    states: history.states,
    setStates: handleSetStates,
    currentIndex: history.currentIndex,
    setCurrentIndex: handleSetCurrentStateIndex,
    addState,
    deleteState,
    nextState,
    previousState,
    clearHistory,
  };
}
