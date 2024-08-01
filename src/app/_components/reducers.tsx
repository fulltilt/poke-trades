"use client";

import React, { createContext, useContext, useReducer } from "react";

type AppContextType = {
  state: State;
  dispatch: React.Dispatch<Actions>;
};

export const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "The App Context must be used within an AppContextProvider",
    );
  }

  return context;
}

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export enum ActionTypes {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
}

export type IncrementAction = {
  type: ActionTypes.INCREMENT;
  payload: number;
};

export type DecrementAction = {
  type: ActionTypes.DECREMENT;
  payload: number;
};

export type Actions = IncrementAction | DecrementAction;

export type State = {
  count: number;
};

export const initialState: State = {
  count: 0,
};

export function reducer(state: State, action: Actions) {
  switch (action.type) {
    case ActionTypes.INCREMENT:
      console.log(state, action);
      return {
        ...state,
        count: action.payload,
      };
    case ActionTypes.DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
}
