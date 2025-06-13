// store.ts
import { createStore } from 'redux';
import { Action, AppState } from './storeTypes';

const initialData: AppState = {
  currentUserData: null,
};

function Reducer(state: AppState = initialData, action: Action): AppState {
  switch (action.type) {
    case 'currentUserData':
      return { ...state, currentUserData: action.payload };
    default:
      return state;
  }
}

const store = createStore(Reducer);

export default store;
