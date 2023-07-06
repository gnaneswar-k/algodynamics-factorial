import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter/counterSlice';
// import { undoableRootReducer } from '../features/factorial/reducers';
import factorialReducer from '../features/factorialPlant/factorialSlice';

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    // factorial: undoableRootReducer,
    factorialSystem: factorialReducer,
  },
});

// export const totalState = store.getState;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
