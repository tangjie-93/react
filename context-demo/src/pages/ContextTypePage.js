import React, { Component } from 'react'
import {ColorContext} from "../context/index"
export default class ContextTypePage extends Component{
    static contextType=ColorContext
    render(){
        const {color} =this.context;
        return(
            <div className="border">
                <h3 className={color}>ContextTypePage</h3>
            </div>
        )
    }
}