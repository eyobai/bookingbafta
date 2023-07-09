// Action types
export const SAVE_ADDRESS_DATA = 'SAVE_ADDRESS_DATA';

// Action creators
export const saveAddressData = (addressData) => ({
  type: SAVE_ADDRESS_DATA,
  payload: addressData,
});

// Initial state for the address data
const initialState = {
  addressData: null,
};

// Reducer function to handle state changes
const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_ADDRESS_DATA:
      return { ...state, addressData: action.payload };
    default:
      return state;
  }
};

export default addressReducer;
