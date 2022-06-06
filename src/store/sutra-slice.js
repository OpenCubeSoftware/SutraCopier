import { createSlice } from '@reduxjs/toolkit';
import {invoke} from "@tauri-apps/api";

const sutraSlice = createSlice({
  name: "sutra",
  initialState: {
    sutraTitles: [],
    sutras: [],
    selectedSutra: '',
    selectedSutraData: {},
  },
  reducers: {
    setSutraData(state, action) {
      state.sutras = action.payload.sutras;
      state.sutraTitles = action.payload.sutraTitles;
    },
    setSelectedSutra(state, action) {
      state.selectedSutra = action.payload.selectedSutra;
      const selectedSutra = state.sutras.find((s) => s.title === action.payload.selectedSutra);
      console.log("Selected sutra is: ", selectedSutra);
      state.selectedSutraData = selectedSutra;
    },
  }
})


export const sutraActions = sutraSlice.actions;
export default sutraSlice;