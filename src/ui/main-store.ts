import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

const initialState: InnerAlert[] = []

const mainSlice = createSlice({
  name: 'main',
  initialState: {
    alerts: initialState,
  },
  reducers: {
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.push({
        _id: uuidv4(),
        ...action.payload
      })
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((alert) => alert._id !== action.payload)
    }
  },
});

export const { addAlert, removeAlert } = mainSlice.actions

export const store = configureStore({
  reducer: mainSlice.reducer
})

export type RootState = ReturnType<typeof store.getState>
