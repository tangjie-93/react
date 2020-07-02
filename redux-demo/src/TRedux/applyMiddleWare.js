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
        //加强dispatch，返回applyMiddleWare中第一个函数的调用的调用 action=>{}
        dispatch=compose(...middleWareChain)(dispatch)
        return {
            ...store,
            dispatch
        }
    }
}
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