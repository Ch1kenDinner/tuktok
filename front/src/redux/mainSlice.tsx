import { createSlice, PayloadAction } from "@reduxjs/toolkit/dist";

export interface IMainState {
	loginFormVisibility: boolean
}

const initialState: IMainState = {
	loginFormVisibility: false
};

export const {reducer: mainReducer, actions: mainActions} = createSlice({
  name: "mainSlice",
  initialState,
  reducers: {
    setField: <T extends keyof IMainState>(
      state,
      { payload }: PayloadAction<{ field: T; value: IMainState[T] }>
    ) => {
			state[payload.field] = payload.value
		},
  },
});
