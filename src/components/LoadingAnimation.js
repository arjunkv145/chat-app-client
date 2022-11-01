import React from 'react'
import './sassStyles/loadingAnimation.scss'

function LoadingAnimation() {
    return (
        <div className='loading-container'>
            <div className='loading-circle circle1'></div>
            <div className='loading-circle circle2'></div>
            <div className='loading-circle circle3'></div>
        </div>
    )
}

export default LoadingAnimation