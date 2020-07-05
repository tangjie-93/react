import React, { Component } from "react"
import { ColorConsumer, UserConsumer } from '../context';
export default class ColorConsumerPage extends Component {
    render () {
        console.log("子组件渲染了")
        return (
            <div>
                <ColorConsumer>
                    {context => (
                        <UserConsumer>
                            {userInfo => (
                                <div className={context.color}>
                                    <p>{userInfo.name}</p>
                                    <p>{userInfo.age}</p>
                                </div>

                            )}
                        </UserConsumer>
                    )}

                </ColorConsumer>

            </div>
        )
    }
}