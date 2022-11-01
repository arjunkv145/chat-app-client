import React from 'react'
import './sassStyles/errorPage.scss'

function ErrorPage() {

    return (
        <div className="error-page">
            <h1 className='title'>Oops!</h1>
            <p className='message'>Sorry, an unexpected error has occurred.</p>
            <p className='status'>
                <i>404 Not found</i>
            </p>
        </div>
    )
}

export default ErrorPage