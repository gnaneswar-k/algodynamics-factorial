import React, { useEffect } from 'react';
import { ActionCreators } from 'redux-undo';
import { nanoid } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
// import axios from 'axios';

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
// import baseURL from '../../../../DT-study-frontend/src/pages/api'

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

let preState: FactorialState;
let type: string;
const runId = nanoid();
let initialised = false;

export function Factorial() {
  const dispatch = useAppDispatch();
  const factValue = useAppSelector(selectFactorial);
  const factArray = useAppSelector(selectArray);
  const indexOne = useAppSelector(selectOne);
  const indexTwo = useAppSelector(selectTwo);
  const state = useAppSelector(selectState);
  // const [queryParameters] = useSearchParams();
  // const userId = queryParameters.get("id");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userId = urlParams.get('id');
  // const userId = useParams();
  let inputValue = 1;
  console.log('id:', 4, 'userId:', userId, 'runId:', runId, 'type:', type, 'preState:', preState, 'postState:', state.present, 'timestamp:', Date.now());

  useEffect(() => {
    console.log('id:', 4, 'userId:', userId, 'runId:', runId, 'type:', type, 'preState:', preState, 'postState:', state.present, 'timestamp:', Date.now());
    // axios
    //   .post(
    //     /* `${baseURL}/ */`/${userId}/post-update-run/`, {
    //     id: 4,
    //     runId: runId,
    //     type: type,
    //     preState: preState,
    //     postState: state.present,
    //     timestamp: Date.now()
    //   })
    //   .then(response => {
    //     console.log(response);
    //     console.log(response.data);
    //   });
  })

  return (
    // Make a function to initialise the factorial value.
    <div>
      <div
        id='Initialiser'
        style={{
          display: initialised ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Initialiser */}
        <input
          aria-label='Initialiser Input Text Box'
          type='text'
          id='initInput'
          name='initInput'
          required
          defaultValue={1}
          size={1}
          onChange={e => { inputValue = Number(e.target.value) }}
          style={{ textAlign: 'center' }}
        />
        <button
          type='button'
          aria-label='initialise'
          onClick={() => {
            preState = { ...state.present };
            type = Action.Init;
            dispatch(Init(inputValue));
            dispatch(ActionCreators.clearHistory());
            initialised = true;
          }}
          disabled={factValue !== null || factArray.length > 0}
        >
          Initialise
        </button>
      </div>
      <div
        style={{
          display: initialised ? 'flex' : 'none',
          flexDirection: 'column',
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
                  type='button'
                  key={index.toString()}
                  onClick={() => {
                    preState = { ...state.present };
                    type = Action.SelectNumber;
                    dispatch(HandleSelect(index));
                  }}
                  className={(factValue === null && factArray.length === 1) ? styles.final : (index === indexOne || index === indexTwo) ? styles.selected : styles.regular}
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
            type='button'
            aria-label='Factorial Rule'
            onClick={() => {
              preState = { ...state.present };
              type = Action.FactorialRule;
              dispatch(FactorialRule());
            }}
            disabled={factValue === null || factValue <= 0}
          >
            Apply Factorial Rule
          </button>
          <button
            type='button'
            aria-label='Multiply Rule'
            onClick={() => {
              preState = { ...state.present };
              type = Action.MultiplyRule;
              if (indexOne === null || indexTwo == null) {
                alert('Please select two numbers to multiply.');
              }
              else {
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
            type='button'
            aria-label='Done Rule'
            onClick={() => {
              preState = { ...state.present };
              type = Action.DoneRule;
              dispatch(DoneRule());
            }}
            disabled={!(factArray.length > 0 && factValue === 0)}
          >
            Apply Done Rule
          </button>
          <button
            type='button'
            aria-label='Zero Rule'
            onClick={() => {
              preState = { ...state.present };
              type = Action.ZeroRule;
              dispatch(ZeroRule());
            }}
            disabled={factValue !== 0}
          >
            Apply Zero Rule
          </button>
          <button
            type='button'
            aria-label='One Rule'
            onClick={() => {
              preState = { ...state.present };
              type = Action.OneRule;
              dispatch(OneRule());
            }}
          >
            Apply One Rule
          </button>
        </div>
        {/* Undo, Redo, Reset Buttons */}
        <div className={styles.row}>
          <button
            type='button'
            aria-label='Undo'
            onClick={() => {
              preState = { ...state.present };
              type = Action.Undo;
              dispatch(ActionCreators.undo());
            }}
            disabled={!state.past.length}
          >
            Undo
          </button>
          <button
            type='button'
            aria-label='Redo'
            onClick={() => {
              preState = { ...state.present };
              type = Action.Redo;
              dispatch(ActionCreators.redo());
            }}
            disabled={!state.future.length}
          >
            Redo
          </button>
          <button
            type='button'
            aria-label='Reset'
            onClick={() => {
              preState = { ...state.present };
              type = Action.Reset;
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
            type='button'
            aria-label='Submit'
            onClick={() => {
              // Submit Action
              preState = { ...state.present };
              type = Action.Submit;
              // console.log('id:', 4, 'runId:', runId, 'type:', type, 'preState:', preState, 'postState:', state.present, 'timestamp:', Date.now());
              // Dialog box to take confirmation of submission.
              let submitStatus = window.confirm("Do you want to confirm submission? Press OK to confirm.");
              // If Confirm Submit
              if (submitStatus) {
                preState = { ...state.present };
                type = Action.ConfirmSubmit;
                // console.log('id:', 4, 'runId:', runId, 'type:', type, 'preState:', preState, 'postState:', state.present, 'timestamp:', Date.now());
                // redirect url
              }
              // If Cancel Submit
              else {
                preState = { ...state.present };
                type = Action.CancelSubmit;
                // console.log('id:', 4, 'runId:', runId, 'type:', type, 'preState:', preState, 'postState:', state.present, 'timestamp:', Date.now());
              }
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
