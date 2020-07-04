## 1、什么Redux？
`redux`是 `javascript` 的状态容器，提供可预测话的状态管理。可以让你构建一致化的应用，运行于不同的环境，并且易于测试。
## 2、Redux的三个原则
+ 单一数据源
整个应用的 `state` 被储存在一棵 `object tree` 中，并且这个 `object tree` 只存在于唯一一个 `store` 中。
+ State 是只读的
唯一改变 `state` 的方法就是触发 `action`，`action` 是一个用于描述已发生事件的普通对象。
+ 使用纯函数来执行修改.
## 3、Redux中的核心概念。
最基础的 `redux` 主要向外以下几个`api`。
### 3.1、基础版的redux
+ getState()
该函数主要用于外界组件获取 `state`。
```js
let initState
function getState(){
    return initState;
}
```
+ dispatch(action)
用于给外界组件将数据传递到 `store` 内部的有效途径。用于修改 `state`。并触发组件更新。
```js
function dispatch(action){
    //修改状态
    initState=reducer(initState,action);
    //触发组件更新
    listeners.forEach(listener=>listener())
    return action
}
```
+ subscribe(listener)
用于给外部组件订阅事件。该方法一般在组件的 `componentDidMount()` 钩子函数中调用。用途在于`state` 发生改变时，触发组件更新。调用该函数会返回一个函数，用于取消订阅，取消订阅一般在 `componentWillUnmount()` 执行。
```js
function subscribe(listener){
        listeners.push(listener)
        return ()=>{
            //为了取消订阅
            const index=listeners.indexOf(listener)
            listeners.splice(index,1)
        }
    }
```
+ reducer(state,action)
这是一个纯函数，主要用于修改 `state`。在 `dispatch`函数中被调用。

### 3.2、进阶的redux
基础版的 `redux` 中的 `action` 只能为一般对象。用中间件函数可以来加强一下，使得 `action` 可以为函数或者 `promise` 对象。这里就会用到 `applyMiddleWare` 中间件函数。
+ applyMiddleWare
```js
export default function applyMiddleWare(...middleWares){
    return createStore=>reducer=>{
        let store=createStore(reducer);
        let dispatch=store.dispatch;
        //构造中间件需要的参数
        const midApi={
            getState:store.getState,
            //为了避免污染，所以返回一个函数
            dispatch:(action,...args)=>dispatch(action,...args)
        }
        const middleWareChain=middleWares.map(middleWare=>middleWare(midApi));
        //加强dispatch
        dispatch=compose(...middleWareChain)(dispatch)
        console.log(dispatch);
        //返回的是 传入applyMiddleWare中到的第一函数调用后的结果
        //    action => {
        //     if (typeof action === 'function') {
        //       return action(dispatch, getState);
        //     } //next可能是dispatch
        //     return next(action);
        //   }
        return {
            ...store,
            dispatch
        }
    }
}
//聚合函数，该函数最终返回的是一个函数，
function compose(...fns){
    const len=fns.length;
    if(len===0){
        return arg=>arg;
    }
    if(len===1){
        return fns[0]
    }
    console.log(fns.reduce((a,b)=>(...args)=>a(b(...args))))
    return fns.reduce((a,b)=>(...args)=>a(b(...args)))
}
```
为了维护多份 `state` 我们就需要用到多个 `reducer`。这时可以 `combineReducers` 函数来对多个 `reducer` 来做一个整合处理。
+ combineReducers
```js
export function combineReducers(reducers){
    //用于返回新的state
    return function combination(state={},action){
        //用于存放多个reducer的state
        let nextState={};
        let hasChanged=false;
        for(let key in reducers){
            const reducer=reducers[key];
            //state为{}返回的就是初始值
            nextState[key]=reducer(state[key],action);
            hasChanged=hasChanged||nextState[key]!==state[key]
        }
        hasChanged=hasChanged||Object.keys(nextState).length!==Object.keys(state).length;
        return hasChanged?nextState:state
    } 
}
```
### 3.3 实例讲解
在这里定义了改变 `state` 的方式，从最简单的同步调用、异步调用(函数调用)、到 `promise` 调用。接下来将详细分析这调用的代码执行流程。
```js
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
                <button onClick={this.add}>添加</button>
                <button onClick={this.asyncAdd}>异步添加</button>
                <button onClick={this.promiseAdd}>promise添加</button>
                <button onClick={this.unmount}>页面卸载</button>
            </div>
        )
    }
}
```
<img src="../../images/加强版redux架构图.png"  alt="暂无图片"/>

+ 同步调用情况
1、在组件页面中调用 `store.dispatch({type:"ADD"})` ,跳转到 `middleWare.js` 文件中的中间件函数中。
2、先进入`thunk` 中间件函数，执行 `next(action)`,因为 `compose(...fns)`,`next()` 为 `logger` 中间件的 `action=>{}` 方法。
3、进入 `logger` 中间件，执行 `next(action)`，因为`compose(...fns)`，`next()` 为 `promiseFn` 中间件的 `action=>{}` 方法。
4、进入 `promiseFn` 中间件，最后执行  `next(action)`,而 `next`是在 最开始的 `compose(...fns)(dispatch)` 传入的 `dispatch` 方法。然后跳转到 `createStore.js` 文件中。
5、在`createStore` 执行 `dispatch(action)` 方法。在里面执行 `reducer()` 方法，跳转到 `combineReducers.js` 文件中。在这里进行 `state` 的修改，最后在组件中执行 `this.forceUpdate()` 刷新组件。
同步方法调用流程图如下所示：
<img src="../../images/redux同步操作路程图.png" />

+ 异步调用情况
1、在组件页面中调用 `store.dispatch(dispatch,getState)=>{setTimeout(() => dispatch({type:"ADD"})}, 1000);})` ,跳转到 `middleWare.js` 文件中的中间件函数中。
2、先进入`thunk` 中间件 函数，执行 `action(dispatch,getState)`,跳转到 `applyMiddleWare.js` 文件中。执行` dispatch:(action,...args)=>dispatch(action,...args)`。
3、然后再次跳转到 `thunk()` 函数中，然后接下来跟同步方法调用的情况一样了。

+ promise调用情况
1、在组件页面中调用 `store.dispatch(Promise.resolve({type:"ADD",payload:100}))`,跳转到 `middleWare.js` 文件中的中间件函数中。
2、先进入`thunk` 中间件 函数， `next(action)`,因为 `compose(...fns)`,`next()` 为 `logger` 中间件的 `action=>{}` 方法。
3、进入 `logger` 中间件，执行 `next(action)`，因为`compose(...fns)`，`next()` 为 `promiseFn` 中间件的 `action=>{}` 方法。
4、进入 `promiseFn` 中间件，执行 `action.then(dispatch)` ,跳转到 `applyMiddleWare.js` 文件中。执行` dispatch:(action,...args)=>dispatch(action,...args)`。
5、然后再次跳转到 `thunk()` 函数中，然后接下来跟同步方法调用的情况一样了。


