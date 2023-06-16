import { createStore, combineReducers } from 'redux';
import { userIdReducer } from './reducer';

const rootReducer = combineReducers({
  userId: userIdReducer,
});

const store = createStore(rootReducer);

export default store;
