import React, { Component } from 'react'
import { RouterContextProvider } from './Context'
export default class Router extends Component {
    static computeRootMatch (pathname) {
        return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
    }
    constructor (props) {
        super(props)

        this.state = {
            location: props.history.location
        }
        //监听location,更新location
        props.history.listen(location => {
            this.setState({ location })
        })
    }

    render () {
        const { children, history } = this.props;
        return (
            <RouterContextProvider value={{ history, location: this.state.location, match: Router.computeRootMatch(this.state.location.pathname) }}>
                {children}
            </RouterContextProvider>
        )
    }
}
