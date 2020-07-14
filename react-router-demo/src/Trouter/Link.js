import React, { Component } from 'react'
import { RouterContext } from "./Context"
export default class Link extends Component {
    //获取context
    static contextType = RouterContext;
    handleClick = (e) => {
        e.preventDefault();
        //命令式修改路由
        this.context.history.push(this.props.to)
    }
    render () {
        const { to, children, ...reatProps } = this.props
        return (
            <a href={to} {...reatProps} onClick={this.handleClick}>{children}</a>
        )
    }
}
