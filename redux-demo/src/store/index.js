import {createStore,applyMiddleWare} from "../TRedux/index"
import {countReducer,todoReducer} from "./reducer"
import { thunk,logger,promiseFn } from '../TRedux/middleWare';
import { combineReducers } from './combineReducers';
// import { combineReducers} from "redux"
const store=createStore(combineReducers({countReducer,todoReducer}),applyMiddleWare(thunk,logger,promiseFn))
export  default store;