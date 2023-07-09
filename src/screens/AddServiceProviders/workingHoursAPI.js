import { useDispatch } from 'react-redux';
import { setWorkingHours } from '../store/actions';

const dispatch = useDispatch();

// Backend logic functions
const saveWorkingHours = (workingHours) => {
  try {
    dispatch(setWorkingHours(workingHours));
    // Additional logic for saving to the database or performing backend operations
  } catch (error) {
    console.log('Error storing working hours:', error);
  }
};

export { saveWorkingHours };
