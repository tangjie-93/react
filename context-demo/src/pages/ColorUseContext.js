import React, { useContext } from 'react'
import { ColorContext } from '../context'

export default function ColorUseContext () {
    const ctx = useContext(ColorContext)
    console.log("ctx", ctx)
    return (
        <div>
            <h3 className={ctx.color}>ColorUseContext</h3>
        </div>
    )
}

