import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { mainReducer } from "./mainSlice";

export const store = configureStore({
  reducer: {
    main: mainReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(m),
});

export const useCustomSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector