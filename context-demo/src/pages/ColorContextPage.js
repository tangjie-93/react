import React, { Component } from "react"
import { ColorProvider, UserProvider } from '../context'
import ColorConsumerPage from './ColorConsumerPage'
import ContextTypePage from './ContextTypePage'
import ColorUseContext from './ColorUseContext'
export default class Color extends Component {
    constructor (props) {
        super(props)
        this.state = {
            theme: {
                color: 'blue'
            }, userInfo: {
                name: 'james',
                age: 18
            }

        }
    }
    changeColor = () => {
        const { color } = this.state.theme
        this.setState({
            theme: {
                color: color === 'blue' ? 'red' : 'blue'
            }
        })
    }
    render () {
        const { theme, userInfo } = this.state;
        return (
            <div>
                <h3>ContextPage</h3>
                <button onClick={this.changeColor}>change color</button>
                <ColorProvider value={theme}>
                    <UserProvider value={userInfo}>
                        <ColorConsumerPage />
                        <ColorUseContext />
                        <ContextTypePage />
                    </UserProvider>

                </ColorProvider>


            </div>
        )
    }
}