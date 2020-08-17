import React, { createContext, useReducer, useContext } from "react";

const GlobalStateContext = createContext("");
const GlobalDispatchContext = createContext("");

const globalReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_PARTICLES_COLOR": {
      return {
        ...state,
        particlesColor: action.payload,
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
export const useGlobalDispatchContext = () => useContext(GlobalDispatchContext);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, {
    colors: { neutral: "#e28413", negative: "#de3c4b", positive: "#86e7b8" },
    particlesColor: "#e28413",
  });

  return (
    <GlobalDispatchContext.Provider value={dispatch}>
      <GlobalStateContext.Provider value={state}>
        {children}
      </GlobalStateContext.Provider>
    </GlobalDispatchContext.Provider>
  );
};
