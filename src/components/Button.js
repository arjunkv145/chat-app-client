import React from 'react'

function Button(props) {
    return (
        <button className='btn' {...props}>
            {props.children}
        </button>
    )
}

export default Button