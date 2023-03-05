import { useReducer } from "react";

const stateReducer = (state, action) => ({ ...state, ...action });

export const useStateReducer = <S extends Record<string, any>>(
  initState: S
): [S, (v: Partial<S>) => void] => useReducer(stateReducer, initState);
