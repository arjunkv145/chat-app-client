import React from 'react'
import { useRouteError } from 'react-router-dom'
import './sassStyles/errorPage.scss'

function ErrorPage() {
    const error = useRouteError()

    return (
        <div className="error-page">
            <h1 className='title'>Oops!</h1>
            <p className='message'>Sorry, an unexpected error has occurred.</p>
            <p className='status'>
                <i>{error.statusText || error.message || error.data}</i>
            </p>
        </div>
    )
}

export default ErrorPage