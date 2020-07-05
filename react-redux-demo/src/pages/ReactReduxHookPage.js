import React from 'react'
import { useDispatch, useSelector } from "../Treact-redux"
export default function ReactReduxHookPage () {
    const count = useSelector(({ count }) => count)
    const dispatch = useDispatch()
    return (
        <div>
            <h3>ReactReduxHookPage</h3>
            <p>{count}</p>
            <button onClick={() => dispatch({ type: "ADD" })}>递增</button>
        </div>
    )
}
