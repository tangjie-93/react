import React from "react"
import { RouterContextConsumer } from './Context'

const withRouter = WrapperComponent => props => {
    return (
        <RouterContextConsumer>
            {
                context => {
                    return <WrapperComponent {...props} {...context}></WrapperComponent>
                }
            }
        </RouterContextConsumer>
    )
}
export default withRouter