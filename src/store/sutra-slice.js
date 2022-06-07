import { createSlice } from '@reduxjs/toolkit';
import {invoke} from "@tauri-apps/api";

const sutraSlice = createSlice({
  name: "sutra",
  initialState: {
    sutraTitles: [],
    sutras: [],
    selectedSutra: '',
    selectedSutraData: {},
    sutraIndex: 0
  },
  reducers: {
    setSutraData(state, action) {
      state.sutras = action.payload.sutras;
      state.sutraTitles = action.payload.sutraTitles;
    },
    setSelectedSutra(state, action) {
      state.selectedSutra = action.payload.selectedSutra;
      const selectedSutra = state.sutras.find((s) => s.title === action.payload.selectedSutra);
      state.selectedSutraData = selectedSutra;
    },
    setSutraIndex(state, action) {
      state.sutraIndex = action.payload.index;
    },
    incrementSutraIndex(state) {
      state.sutraIndex++;
    },
    decrementSutraIndex(state) {
      state.sutraIndex--;
    }
  }
})


export const sutraActions = sutraSlice.actions;
export default sutraSlice;