import React, { useEffect, useState } from 'react';
import { ActionCreators } from 'redux-undo';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  Init,
  FactorialRule,
  MultiplyRule,
  DoneRule,
  ZeroRule,
  OneRule,
  HandleSelect,
  HandleReset,
  selectFactorial,
  selectArray,
  selectOne,
  selectTwo,
  selectState,
  FactorialState,
} from './factorialSlice';
import styles from './Factorial.module.css';
import API from '../../app/api';

// List of Actions
const Action = Object.freeze({
  Init: 'Init',
  Undo: 'Undo',
  Redo: 'Redo',
  Reset: 'Reset',
  Submit: 'Submit',
  CancelSubmit: 'CancelSubmit',
  ConfirmSubmit: 'ConfirmSubmit',
  FactorialRule: 'FactorialRule',
  MultiplyRule: 'MultiplyRule',
  DoneRule: 'DoneRule',
  ZeroRule: 'ZeroRule',
  OneRule: 'OneRule',
  SelectNumber: 'SelectNumber',
})

// API Function Calls
const createRun = async (userId: string, setRunId: any) => {
  await API
    .post(
      `/createRun`, JSON.stringify({
        id: userId,
        machineType: 4,
      })
    )
    .then(response => {
      // console.log(response);
      // console.log(response.data);
      // runId = response.data.id;
      setRunId(response.data.id);
    })
    .catch(error => {
      console.log(error);
    });
};

const updateRun = async (
  payload: any,
  runId: string,
  type: string,
  preState: FactorialState,
  postState: FactorialState
) => {
  // If runId is undefined, then the user has not been initialised
  if (runId === "") {
    return;
  }
  console.log(JSON.stringify({
    id: runId,
    payload: payload === undefined ? {} : payload,
    type: type,
    preState: preState === undefined ? {} : preState,
    postState: postState === undefined ? {} : postState,
    timestamp: Date.now()
  }));
  await API
    .post(
      `/updateRun`, JSON.stringify({
        id: runId,
        payload: payload === undefined ? {} : payload,
        type: type,
        preState: preState === undefined ? {} : preState,
        postState: postState === undefined ? {} : postState,
        timestamp: Date.now()
      })
    )
    .then(response => {
      console.log(response);
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
};

// Initialisation
// let preState: FactorialState;
// let type: string;
// let initialised = false;
// let runId: string;

// Getting User ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userId = urlParams.get('id');

export function Factorial() {
  // Redux
  const dispatch = useAppDispatch(); // Used to call any Redux reducer.
  // Fetches required value from Redux store.
  const factValue = useAppSelector(selectFactorial);
  const factArray = useAppSelector(selectArray);
  const indexOne = useAppSelector(selectOne);
  const indexTwo = useAppSelector(selectTwo);
  const state = useAppSelector(selectState);

  // Initialisation
  let inputValue = 1;
  const [runId, setRunId] = useState("");
  const [preState, setPreState] = useState<FactorialState>(
    {} as FactorialState
  );
  const [type, setType] = useState("Uninitialised");
  const [initialised, setInitialised] = useState(false);
  const [clickedSubmit, setClickedSubmit] = useState(false);

  // Generating Run ID
  if (userId !== null && runId === "") {
    createRun(userId, setRunId);
  }

  // Logging after every user action
  useEffect(() => {
    if (userId !== null) {
      updateRun({}, runId, type, preState, state.present);
    }
  });

  // Post-Submit confirmation
  if (clickedSubmit) {
    // Dialog box to take confirmation of submission.
    let submitStatus = window.confirm(
      "Do you want to confirm submission? Press OK to confirm."
    );
    // If Confirm Submit
    if (submitStatus) {
      setPreState({ ...state.present });
      setType(Action.ConfirmSubmit);
      // console.log('id:', 4, 'runId:', runId, 'type:', type, 'preState:', preState, 'postState:', state.present, 'timestamp:', Date.now());
      // redirect url
    }
    // If Cancel Submit
    else {
      setPreState({ ...state.present });
      setType(Action.CancelSubmit);
      // console.log('id:', 4, 'runId:', runId, 'type:', type, 'preState:', preState, 'postState:', state.present, 'timestamp:', Date.now());
    }
    setClickedSubmit(false);
  };
  if (type === Action.ConfirmSubmit) {
    console.log("Confirmed."); // For testing.
  }

  return (
    <div>
      <div
        id="Initialiser"
        style={{
          display: initialised ? "none" : "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Initialiser */}
        <input
          aria-label="Initialiser Input Text Box"
          type="text"
          id="initInput"
          name="initInput"
          required
          defaultValue={1}
          size={1}
          onChange={(e) => {
            inputValue = Number(e.target.value);
          }}
          style={{ textAlign: "center" }}
        />
        <button
          type="button"
          aria-label="initialise"
          onClick={() => {
            setPreState({ ...state.present });
            setType(Action.Init);
            dispatch(Init(inputValue));
            dispatch(ActionCreators.clearHistory());
            setInitialised(true);
          }}
          disabled={factValue !== null || factArray.length > 0}
        >
          Initialise
        </button>
      </div>
      <div
        style={{
          display: initialised ? "flex" : "none",
          flexDirection: "column",
        }}
      >
        {/* Number */}
        <div className={styles.row}>
          <span className={styles.fact}>{factValue}</span>
        </div>
        {/* Array */}
        <div className={styles.row}>
          <div className={styles.array}>
            <span>
              {factArray.map((num, index) => (
                <button
                  type="button"
                  key={index.toString()}
                  onClick={() => {
                    setPreState({ ...state.present });
                    setType(Action.SelectNumber);
                    dispatch(HandleSelect(index));
                  }}
                  className={
                    factValue === null && factArray.length === 1
                      ? styles.final
                      : index === indexOne || index === indexTwo
                        ? styles.selected
                        : styles.regular
                  }
                >
                  {num}
                </button>
              ))}
            </span>
          </div>
        </div>
        {/* Main Rule Buttons */}
        <div className={styles.row}>
          <button
            type="button"
            aria-label="Factorial Rule"
            onClick={() => {
              setPreState({ ...state.present });
              setType(Action.FactorialRule);
              dispatch(FactorialRule());
            }}
            disabled={factValue === null || factValue <= 0}
          >
            Apply Factorial Rule
          </button>
          <button
            type="button"
            aria-label="Multiply Rule"
            onClick={() => {
              setPreState({ ...state.present });
              setType(Action.MultiplyRule);
              if (indexOne === null || indexTwo == null) {
                alert("Please select two numbers to multiply.");
              } else {
                dispatch(MultiplyRule());
              }
            }}
            disabled={factArray.length <= 1}
          >
            Apply Multiply Rule
          </button>
        </div>
        {/* Special Rule Buttons */}
        <div className={styles.row}>
          <button
            type="button"
            aria-label="Done Rule"
            onClick={() => {
              setPreState({ ...state.present });
              setType(Action.DoneRule);
              dispatch(DoneRule());
            }}
            disabled={!(factArray.length > 0 && factValue === 0)}
          >
            Apply Done Rule
          </button>
          <button
            type="button"
            aria-label="Zero Rule"
            onClick={() => {
              setPreState({ ...state.present });
              setType(Action.ZeroRule);
              dispatch(ZeroRule());
            }}
            disabled={factValue !== 0}
          >
            Apply Zero Rule
          </button>
          <button
            type="button"
            aria-label="One Rule"
            onClick={() => {
              setPreState({ ...state.present });
              setType(Action.OneRule);
              dispatch(OneRule());
            }}
          >
            Apply One Rule
          </button>
        </div>
        {/* Undo, Redo, Reset Buttons */}
        <div className={styles.row}>
          <button
            type="button"
            aria-label="Undo"
            onClick={() => {
              setPreState({ ...state.present });
              setType(Action.Undo);
              dispatch(ActionCreators.undo());
            }}
            disabled={!state.past.length}
          >
            Undo
          </button>
          <button
            type="button"
            aria-label="Redo"
            onClick={() => {
              setPreState({ ...state.present });
              setType(Action.Redo);
              dispatch(ActionCreators.redo());
            }}
            disabled={!state.future.length}
          >
            Redo
          </button>
          <button
            type="button"
            aria-label="Reset"
            onClick={() => {
              setPreState({ ...state.present });
              setType(Action.Reset);
              dispatch(HandleReset());
              dispatch(Init(inputValue));
              dispatch(ActionCreators.clearHistory());
            }}
            disabled={!state.future.length && !state.past.length}
          >
            Reset
          </button>
        </div>
        {/* Submit Button */}
        <div className={styles.row}>
          <button
            type="button"
            aria-label="Submit"
            onClick={() => {
              // Submit Action
              setPreState({ ...state.present });
              setType(Action.Submit);
              setClickedSubmit(true);
              // console.log('id:', 4, 'runId:', runId, 'type:', type, 'preState:', preState, 'postState:', state.present, 'timestamp:', Date.now());
            }}
            disabled={!state.past.length}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
