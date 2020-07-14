import React from 'react'
import { RouterContextConsumer } from "./Context";
import LifeCycle from './LifeCycle';
export function Prompt ({ message, when = true }) {
    return (
        <RouterContextConsumer>
            {context => {
                if (!when) {
                    return null
                }
                let method = context.history.block;
                return (
                    <LifeCycle
                        onMount={self => { self.release = method(message); }}
                        onUnMount={self => { self.release() }}
                    />
                )
            }}
        </RouterContextConsumer>

    )
}
