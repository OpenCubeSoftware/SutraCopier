import {createSlice} from '@reduxjs/toolkit';

const sutraSlice = createSlice({
  name: "sutra",
  initialState: {
    sutraTitles: [],
    sutras: [],
    selectedSutra: '',
    selectedSutraData: {},
    sutraIndex: 0,
    settingsSutras: []
  },
  reducers: {
    setSutraData(state, action) {
      state.sutras = action.payload.sutras;
      state.sutraTitles = action.payload.sutraTitles;
    },
    setSelectedSutra(state, action) {
      state.selectedSutra = action.payload.selectedSutra;
      state.selectedSutraData = state.sutras.find((s) => s.title === action.payload.selectedSutra);
      state.sutraIndex = 0;
    },
    setSelectedSutraWithIndex(state, action) {
      state.selectedSutra = action.payload.selectedSutra;
      state.selectedSutraData = state.sutras.find((s) => s.title === action.payload.selectedSutra);
      state.sutraIndex = action.payload.currentIndex;
    },
    setSutraIndex(state, action) {
      state.sutraIndex = action.payload.index;
    },
    setSutraSettings(state, action) {
      state.settingsSutras = action.payload.settings;
    },
    useSutraFromSettings(state, action) {
      state.useSettingsSutra = true;
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