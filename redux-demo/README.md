## 什么Redux？
`redux`是 `javascript` 的状态容器，提供可预测话的状态管理。可以让你构建一致化的应用，运行于不同的环境，并且易于测试。
## Redux的三个原则
+ 单一数据源
整个应用的 `state` 被储存在一棵 `object tree` 中，并且这个 `object tree` 只存在于唯一一个 `store` 中。
+ State 是只读的
唯一改变 `state` 的方法就是触发 `action`，`action` 是一个用于描述已发生事件的普通对象。
+ 使用纯函数来执行修改.
## Redux中的核心概念。
最基础的 `redux` 主要向外以下几个`api`。
### 基础版的redux
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
            const index=listeners.indexOf(listener)
            listeners.splice(index,1)
        }
    }
```
+ reducer(state,action)
这是一个纯函数，主要用于修改 `state`。在 `dispatch`函数中被调用。

### 进阶的redux
基础版的 `redux` 中的 `action` 只能为一般对象。用中间件函数可以来加强一下，使得 `action` 可以为函数或者 `promise` 对象。这里就会用到 `applyMiddleWare` 中间件函数。
+ applyMiddleWare
```js
export default function applyMiddleWare(...middleWares){
    debugger
    return createStore=>reducer=>{
        debugger
        let store=createStore(reducer);
        let dispatch=store.dispatch;
        //构造中间件需要的参数
        const midApi={
            getState:store.getState,
            //为了避免污染，所以返回一个函数
            dispatch:(action,...args)=>dispatch(action,...args)
        }
        const middleWareChain=middleWares.map(middleWare=>middleWare(midApi));
        //加强dispatch，使dispatch为applyMiddleWare中第一个函数的返回函数的返回函数。 action=>{}，所以但我们在组件中调用 dispatch(action)时，最先进入的中间件函数为第一个函数，action为dispatch传入的action。next函数为它右边的中间件的action函数。然后将action传递给它右边的中间件，这样一直向右传递，知道没有中间件为止。
        dispatch=compose(...middleWareChain)(dispatch)
        return {
            ...store,
            dispatch
        }
    }
}
//聚合函数
function compose(...fns){
    const len=fns.length;
    if(len===0){
        return arg=>arg;
    }
    if(len===1){
        return fns[0]
    }
    return fns.reduce((a,b)=>(...args)=>a(b(...args)))
}
```
为了维护多份 `state` 我们就需要用到多个 `reducer`。这时可以 `combineReducers` 函数来对多个 `reducer` 来做一个整合处理。
+ combineReducers
```js
export function combineReducers(reducers){
    return function combination(state={},action){
        //用于存放多个reducer的state
        let nextState={};
        let hasChanged=false;
        for(let key in reducers){
            const reducer=reducers[key];
            nextState[key]=reducer(state[key],action);
            hasChanged=hasChanged||nextState[key]!==state[key]
        }
        hasChanged=hasChanged||Object.keys(nextState).length!==Object.keys(state).length;
        return hasChanged?nextState:state
    } 
}
```
