import {createSlice} from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentPage: 'index',
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload.page
    },
  },
})

export const uiActions = uiSlice.actions;

export default uiSlice;