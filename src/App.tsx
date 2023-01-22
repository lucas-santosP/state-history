import React from "react";
import { ToastContainer, toast } from "react-toastify";

import { CircleStates } from "./components/CircleStates";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer position="top-center" theme="dark" bodyClassName={"toast-body"} />
      <CircleStates />
    </>
  );
};

export { App };
