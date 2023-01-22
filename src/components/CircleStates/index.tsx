import React from "react";
import { useStateHistory } from "../../hooks/useStateHistory";
import { toast } from "react-toastify";

const CTRL_Z_KEY = "\x1A";
const CTRL_Y_KEY = "\x19";

function errorHandler(err: Error | any, showToast?: boolean) {
  const message = err?.message || "Ops! Something went wrong.";
  !showToast && toast.warn("Error: " + message, { toastId: message });
  console.warn("Error: " + message);
}

const CircleStates: React.FC = () => {
  const circleElement = React.useRef<null | HTMLDivElement>(null);

  const stateHistory = useStateHistory<[number, number]>();

  function updateCircleElementPosition(x: number, y: number) {
    if (!circleElement.current) return;

    circleElement.current.classList.add("circle");
    circleElement.current.style.top = y + "px";
    circleElement.current.style.left = x + "px";
    circleElement.current.classList.remove("hidden");
  }

  function handleBodyClick(e: MouseEvent) {
    try {
      stateHistory.addState([e.clientX, e.clientY]);
    } catch (error) {
      errorHandler(error);
    }
  }

  function handleKeypress(e: KeyboardEvent) {
    try {
      if (e.key === CTRL_Z_KEY) stateHistory.previousState();
      else if (e.key === CTRL_Y_KEY) stateHistory.nextState();
    } catch (error) {
      errorHandler(error, false);
    }
  }

  function handleCurrentStateChange(states: [number, number][], currentIndex: number) {
    if (states.length) {
      const [x, y] = states[currentIndex];
      updateCircleElementPosition(x, y);
    }
  }

  React.useEffect(() => {
    document.body.addEventListener("click", handleBodyClick);
    document.body.addEventListener("keypress", handleKeypress);
    handleCurrentStateChange(stateHistory.states, stateHistory.currentIndex);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
      document.body.removeEventListener("keypress", handleKeypress);
    };
  }, [stateHistory.states, stateHistory.currentIndex]);

  return (
    <div className="">
      <div ref={circleElement} className="circle hidden"></div>

      <div className="instructions">
        <p>CTRL + Z = Undo</p>
        <p>CTRL + Y = Redo</p>
      </div>
    </div>
  );
};

export { CircleStates };
