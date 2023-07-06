import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import undoable from 'redux-undo';

// Defining the interface for the state.
export interface FactorialState {
  factorial: number | null;
  /*
  Factorial is initially the starting number.
  As the factorial button is pressed, the number decreases.
  Finally, it becomes null at the terminal state.
  */
  array: number[];
  /*
  Array contains the numbers for multiplication.
  This is initially empty. As the plant progresses, numbers are added in here.
  When two numbers are selected and multiply is pressed, the result is stored.
  Finally, the array contains only one value after all multiplications.
  */
  selectedIndexOne: number | null;
  selectedIndexTwo: number | null;
  // Indexes to store which numbers have been selected in the array.
};

// Initial state.
const initialState: FactorialState = {
  factorial: null,
  array: [],
  selectedIndexOne: null,
  selectedIndexTwo: null,
};

export const factorialSlice = createSlice({
  name: 'factorialSystem',
  initialState,
  reducers: {
    Init: (state, action: PayloadAction<number>) => {
      state.factorial = action.payload;
    },
    FactorialRule: (state) => {
      // (n + 1, m) => (n, m ∪ {n + 1}), n >= 0
      if (state.factorial !== null && state.factorial >= 1) {
        state.array.push(state.factorial);
        state.factorial -= 1;
      }
    },
    MultiplyRule: (state) => {
      // (n, m ∪ {i, j}) => (n, m ∪ {i * j})
      if (state.selectedIndexOne !== null && state.selectedIndexTwo !== null) {
        // Multiplied value which is to be added to the array.
        const value = state.array[state.selectedIndexOne] * state.array[state.selectedIndexTwo];

        // Removing the values which were multiplied from the array.
        // Deleting the first index value from the array.
        state.array.splice(state.selectedIndexOne, 1);
        // If second index is numerically after first index, its value decreases by one after deleting first index.
        if (state.selectedIndexTwo > state.selectedIndexOne) {
          state.array.splice(state.selectedIndexTwo - 1, 1);
        }
        // If second index is numerically before first index, its value does not change after deleting first index.
        else {
          state.array.splice(state.selectedIndexTwo, 1);
        }

        // Inserting the multiplied value.
        state.array.push(value);

        // Resetting the selected indexes.
        state.selectedIndexOne = null;
        state.selectedIndexTwo = null;
      }
    },
    DoneRule: (state) => {
      // (0, m) => (~, m), m ≠ {}
      if (state.factorial === 0) {
        state.factorial = null;
      }
    },
    ZeroRule: (state) => {
      // (0, m) => (~, m ∪ {1})
      if (state.factorial === 0) {
        state.factorial = null;
        state.array.push(1);
      }
    },
    OneRule: (state) => {
      // (n, m) => (n, m ∪ {1})
      state.array.push(1);
    },
    HandleSelect: (state, action: PayloadAction<number>) => {
      // Select or deselect an array element.
      if (state.selectedIndexOne === action.payload) {
        state.selectedIndexOne = null;
      }
      else if (state.selectedIndexTwo === action.payload) {
        state.selectedIndexTwo = null;
      }
      else if (state.selectedIndexOne === null) {
        state.selectedIndexOne = action.payload;
      }
      else /* if (state.selectedIndexTwo === null) */ {
        state.selectedIndexTwo = action.payload;
      }
    },
    HandleReset: () => initialState, // Resetting the state to its initial value.
  },
});

// Exporting the reducers for reading by the app.
export const { Init, FactorialRule, MultiplyRule, DoneRule, ZeroRule, OneRule, HandleReset, HandleSelect } = factorialSlice.actions;

// Exporting the state for reading by the app.
export const selectFactorial = (state: RootState) => state.factorialSystem.present.factorial;
export const selectArray = (state: RootState) => state.factorialSystem.present.array;
export const selectOne = (state: RootState) => state.factorialSystem.present.selectedIndexOne;
export const selectTwo = (state: RootState) => state.factorialSystem.present.selectedIndexTwo;
export const selectState = (state: RootState) => state.factorialSystem;

// Exporting the reducers to the store with undo-redo ability.
export default undoable(factorialSlice.reducer);