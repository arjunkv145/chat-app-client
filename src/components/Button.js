import React from 'react'
import './sassStyles/button.scss'

function Button(props) {
    return (
        <button className='btn' {...props}>{props.children}</button>
    )
}

export default Button