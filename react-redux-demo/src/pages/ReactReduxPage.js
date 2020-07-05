import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux';
import { connect } from "../Treact-redux"
@connect(
    // mapStateToProps 把state放到props上一份
    ({ count }) => ({ count }),
    // mapDispatchToProps object|function 把dispatch放到props上一份
    //object形式
    // {
    //     add: () => ({ type: "ADD" }),
    //     minus: () => ({ type: "MINUS" }),
    // },
    //function形式
    dispatch => {
        let creators = {
            add: () => dispatch({ type: "ADD", payload: 100 }),
            minus: () => dispatch({ type: "MINUS", payload: 100 }),
        }
        return { ...creators }
    },
    // dispatch => {
    //     let creators = {
    //         add: () => ({ type: "ADD", payload: 100 }),
    //         minus: () => ({ type: "MINUS", payload: 100 })
    //     };
    //     //将使用dispatch来调用action
    //     creators = bindActionCreators(creators, dispatch);
    //     return { ...creators };
    // }
)
class ReactReduxPage extends Component {
    render () {
        console.log(this)
        const { count, add, minus } = this.props
        return (
            <div>
                <h3>ReactReduxPage</h3>
                <p>{count}</p>
                <button onClick={add}>递增</button>
                <button onClick={minus}>递减</button>
            </div>
        )
    }
}
export default ReactReduxPage
