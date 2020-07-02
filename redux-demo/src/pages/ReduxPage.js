import React,{Component} from 'react'
import store from '../store/'
export default class ReduxPage extends Component{
    componentDidMount(){
       this.unsubscribe=store.subscribe(()=>{
            this.forceUpdate()
        })
    }
    componentWillUnmount(){
        this.unsubscribe&&this.unsubscribe()
    }
    add=()=>{
        store.dispatch({type:"ADD"})
    }
    asyncAdd=()=>{
        store.dispatch((dispatch,getState)=>{
            setTimeout(() => {
                dispatch({type:"ADD"})
            }, 1000);
        })
    }
    promiseAdd=()=>{
        store.dispatch(
            Promise.resolve({
                type:"ADD",
                payload:100
            })
        )
    }
    unmount=()=>{
        this.unsubscribe&&this.unsubscribe()
    }
    render(){
       const {countReducer,todoReducer}=store.getState()
       console.log(todoReducer)
        return(
            <div>
                <h3>Redux page</h3>
        <p>{countReducer}{todoReducer}</p>
                <button onClick={this.add}>添加</button>
                <button onClick={this.asyncAdd}>异步添加</button>
                <button onClick={this.promiseAdd}>promise添加</button>
                <button onClick={this.unmount}>页面卸载</button>
            </div>
        )
    }
}