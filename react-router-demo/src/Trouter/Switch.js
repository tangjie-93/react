import React, { Component } from 'react'
import { RouterContextConsumer } from './Context'
import { matchPath } from 'react-router-dom';

export default class Switch extends Component {
    render () {
        return <RouterContextConsumer>
            {
                context => {
                    const { location } = context;
                    //找到匹配的元素
                    let match;
                    //匹配的元素
                    let element;
                    const { children } = this.props
                    //完全匹配
                    React.Children.forEach(children, child => {
                        if (match == null && React.isValidElement(child)) {
                            //一直没有匹配到，就用最后一个
                            element = child;
                            const { path } = child.props;
                            match = path ? matchPath(location.pathname, child.props) : context.match
                        }
                    })

                    return match ? React.cloneElement(element, {
                        computedMatch: match
                    }) : null
                }
            }
        </RouterContextConsumer>

    }
}
