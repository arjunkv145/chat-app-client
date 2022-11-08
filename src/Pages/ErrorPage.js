import React from 'react'
import { useRouteError } from 'react-router-dom'

function ErrorPage() {
    const error = useRouteError()

    return (
        <main className="error">
            <h1 className='error__title'>Oops!</h1>
            <p className='error__content'>Sorry, an unexpected error has occurred.</p>
            <p className='error__info'>
                <i>{error.statusText || error.message || error.data}</i>
            </p>
        </main>
    )
}

export default ErrorPage