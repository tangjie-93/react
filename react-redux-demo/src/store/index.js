import { createStore, combineReducers } from "redux"

export const countReducer = (state = 0, { type, payload = 1 }) => {
    switch (type) {
        case "ADD":
            return state + payload;
        case "MINUS":
            return state - payload;
        default:
            return state
    }
}

export default createStore(combineReducers({ count: countReducer }))