import React, { useContext, useReducer, useLayoutEffect } from 'react'
const Context = React.createContext();
//children为子元素
export function Provider ({ children, store }) {
    console.log(children, store)
    return <Context.Provider value={store}>{children}</Context.Provider>
}
/**
 * 
 * @param {Function} mapStateToProps  state => state是默认值
 * @param {Function|Object} mapDispatchToProps 
 * @param {Function|Class} WrappedComponent 要被装饰的组件
 * @param {Object} props 从父组件传入的参数
 */
export const connect = (mapStateToProps = state => state, mapDispatchToProps) => WrappedComponent => props => {
    //获取store
    const store = useContext(Context);
    const { getState, dispatch, subscribe } = store;
    //获取state
    const stateProps = mapStateToProps(getState());
    let dispatchProps = {
        dispatch
    }
    if (typeof mapDispatchToProps === "function") {
        dispatchProps = mapDispatchToProps(dispatch);
    } else if (typeof mapDispatchToProps === "object") {
        debugger
        dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
    }
    /* 函数组件实现forceUpdate的方法**/
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    useLayoutEffect(() => {
        const unsubscribe = subscribe(() => {
            forceUpdate();
        });
        return () => {
            unsubscribe && unsubscribe();
        };
    }, [subscribe]);
    /* 函数组件实现forceUpdate的方法**/
    return <WrappedComponent  {...props} {...stateProps} {...dispatchProps} />;
}
/**
 * 
 * @param {Function} creator 
 * @param {Function} dispatch 
 */
function bindActionCreator (creator, dispatch) {
    return (...args) => dispatch(creator(...args))
}
export function bindActionCreators (creators, dispatch) {
    //将 add:()=>({type:"ADD"}) 构造成 add:()=>dispatch({type:"ADD"})
    const obj = {};
    for (let key in creators) {
        obj[key] = bindActionCreator(creators[key], dispatch)
    }
    return obj;
}

export function useSelector (selector) {
    const store = useStore()
    const { getState, subscribe } = store;
    const seletorState = selector(getState())
    /*****h函数式组件，刷新组件的方式 */
    const [, forceUpdate] = useReducer(x => x + 1, 0)
    useLayoutEffect(() => {
        const unSubscribe = subscribe(() => {
            forceUpdate()
        })
        return () => {
            unSubscribe && unSubscribe()
        }
    }, [store, subscribe])
    /*****h函数式组件，刷新组件的方式 */
    return seletorState
}
export function useDispatch () {
    const { dispatch } = useStore()
    return dispatch
}

function useStore () {
    return useContext(Context)
}