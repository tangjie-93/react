import {isFSA} from "flux-standard-action";
// 判读是否是promise类型
import isPromise from "is-promise";
//参数是从 applyMiddleWare传递过来的
export  function thunk({getState,dispatch}){
    //这里的next是由它在applyMiddleWare函数中的调用顺序决定的，在这里next是logger的action=>{}
    return next=>action=>{
        debugger
        if(typeof action ==='function'){
           return action(dispatch,getState)
        }
        //next可能是dispatch
        return next(action)
    }
}
export function logger({getState,dispatch}){
    //在这里next是promiseFn的action=>{}
    return next=>action=>{
        console.log("=================")
        const previousState=getState();
        console.log("previousState",previousState);
          //next就是dispatch，action就是dispa的参数
        const returnValue=next(action)
        const nextState=getState()
        console.log("next state", nextState); //sy-log
        console.log("======================"); //sy-log

        return returnValue

    }
}
export function promiseFn({getState,dispatch}){
    //这里的next是dispatch
    return next=>action=>{
        //判断action是否标准
        if(!isFSA(action)){
            return isPromise(action)?action.then(dispatch):next(action)
        }
        return isPromise(action.payload)?
        action.payload.then(res=>dispatch({...action,payload:res})):next(action)
    }
}