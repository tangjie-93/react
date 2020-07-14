import React, { Component } from 'react'
import { createBrowserHistory } from "history"
import Router from "./Router"

export default class BrowserRouter extends Component {
    constructor (props) {
        super(props)
        this.history = createBrowserHistory()
    }

    render () {
        const { children } = this.props;
        return (
            <Router children={children} history={this.history} />
        )
    }
}
