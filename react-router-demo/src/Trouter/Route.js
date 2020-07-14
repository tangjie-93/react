import React, * as react from 'react'
import { RouterContextConsumer, RouterContextProvider } from "./Context"
import { matchPath } from 'react-router-dom';


export default class Route extends react.Component {
    render () {
        return (
            <RouterContextConsumer>
                {
                    context => {
                        const { path, component, children, render, computedMatch } = this.props
                        const { location } = context;
                        const match = computedMatch ? computedMatch : path ? matchPath(location.pathname, this.props) : context.match;
                        const props = {
                            ...context,
                            location,
                            match
                        };
                        // match|children|render判断，
                        return (
                            //将修改的match传递下去，不然match一直用的是最初始的match
                            <RouterContextProvider value={props}>
                                {
                                    match ?
                                        (children ? (typeof children === 'function' ? children(props)
                                            : children)
                                            : (component ? (React.createElement(component, props))
                                                : (render ? render()
                                                    : null)))
                                        : (typeof children === 'function' ? children(props)
                                            : null)
                                }
                            </RouterContextProvider>
                        )


                    }

                }
            </RouterContextConsumer>
        )


    }
}
