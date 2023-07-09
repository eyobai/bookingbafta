const initialState = {
    workingHours: {
      Monday: { start: '', end: '', isEnabled: true },
      Tuesday: { start: '', end: '', isEnabled: true },
      Wednesday: { start: '', end: '', isEnabled: true },
      Thursday: { start: '', end: '', isEnabled: true },
      Friday: { start: '', end: '', isEnabled: true },
      Saturday: { start: '', end: '', isEnabled: true },
      Sunday: { start: '', end: '', isEnabled: true },
    },
  };
  
  const SET_WORKING_HOURS = 'SET_WORKING_HOURS';
  
  export const setWorkingHours = (workingHours) => {
    return {
      type: SET_WORKING_HOURS,
      payload: workingHours,
    };
  };
  
  const workingHoursReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_WORKING_HOURS:
        return {
          ...state,
          workingHours: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default workingHoursReducer;
  