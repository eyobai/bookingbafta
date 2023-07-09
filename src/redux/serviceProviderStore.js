// userStore.js
// Action types
export const SAVE_USER_DATA = 'SAVE_USER_DATA';

// Action creators
export const saveUserData = (userData) => ({
  type: SAVE_USER_DATA,
  payload: userData,
});

// Initial state for the user data
const initialState = {
  userData: null,
};

// Reducer function to handle state changes
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER_DATA:
      return { ...state, userData: action.payload };
    default:
      return state;
  }
};

export default userReducer;
