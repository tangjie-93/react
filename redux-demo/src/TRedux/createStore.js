export default function createStore(reducer,enhancer){
    if(enhancer){
        return enhancer(createStore)(reducer)
    }
    let initState;
    const listeners=[];
    function getState(){
        return initState;
    }
    function dispatch(action){
        debugger
        initState=reducer(initState,action);
        listeners.forEach(listener=>listener())
        return action
    }
    function subscribe(listener){
        listeners.push(listener)
        return ()=>{
            const index=listeners.indexOf(listener)
            listeners.splice(index,1)
        }
    }
    //使initState获取默认值
    dispatch({type:"XXXX"})
    return {
        getState,
        dispatch,
        subscribe
    }
}