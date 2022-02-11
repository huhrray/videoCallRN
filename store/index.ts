import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import { userReducer } from './reducer/userReducer';

const middleware = [thunk];
const rootReducer = combineReducers({userReducer})

const initialState = {};

export type RootState = ReturnType<typeof rootReducer>

const Store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware),
);

export default Store;
