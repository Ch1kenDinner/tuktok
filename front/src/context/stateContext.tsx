import { createContext, PropsWithChildren, useContext, Context, Dispatch } from "react";
import { useStateReducer } from "../hooks/useStateReducer";

export const StateContext = createContext(null);

interface Props<S> extends PropsWithChildren {
  context: Context<{ mainState: S; setMainState: Dispatch<Partial<S>> }>;
  initialState: S;
}

export const StateContextProvider = <S extends Record<string, any>>({
	context,
  children,
  initialState,
}: Props<S>) => {
  const [state, setState] = useStateReducer(initialState);

  return (
    <context.Provider value={{mainState: state, setMainState: setState}}>
      {children}
    </context.Provider>
  );
};
