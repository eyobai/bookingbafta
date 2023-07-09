import { createStore, combineReducers } from 'redux';

// Action types
const SET_USER_ID = "SET_USER_ID";

// Action creators
export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId,
});

// Reducers
const initialState = {
  userId: '',
};

const userIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  userId: userIdReducer,
});

// Create store
const store = createStore(rootReducer);

export default userIdReducer ;
