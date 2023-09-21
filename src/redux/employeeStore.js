import { createStore, combineReducers } from 'redux';

// Action types
const SET_EMPLOYEE_ID = "SET_EMPLOYEE_ID";

// Action creators
export const setEmployeeId = (employeeId) => ({
  type: SET_EMPLOYEE_ID,
  payload: employeeId,
});

// Reducers
const initialState = {
  employeeId: '',
};

const employeeIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMPLOYEE_ID:
      return {
        ...state,
        employeeId: action.payload,
      };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  employeeIdId: employeeIdReducer,
});

// Create store
const store = createStore(rootReducer);

export default employeeIdReducer;
