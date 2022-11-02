import React from 'react'
import './sassStyles/pageLoader.scss'

function PageLoader() {
    return (
        <div className='page-loading-container'>
            <div className='loading-circle circle1'></div>
            <div className='loading-circle circle2'></div>
            <div className='loading-circle circle3'></div>
        </div>
    )
}

export default PageLoader