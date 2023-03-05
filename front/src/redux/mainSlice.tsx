import { createSlice, PayloadAction } from "@reduxjs/toolkit/dist";
import { IPopupMessage } from "../components/ErrorPopup";

export interface IMainState {
  loginFormVisibility: boolean;
  searchingTopics: string[];
  popupMessage?: IPopupMessage;
}

const initialState: IMainState = {
  loginFormVisibility: false,
  searchingTopics: [],
};

export const { reducer: mainReducer, actions: mainActions } = createSlice({
  name: "mainSlice",
  initialState,
  reducers: {
    setField: (
      state: IMainState,
      { payload }: PayloadAction<Partial<IMainState>>
    ) => ({ ...state, ...payload }),
  },
});
