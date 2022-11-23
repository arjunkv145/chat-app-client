import React from 'react'
import { useRouteError } from 'react-router-dom'

function ErrorPage() {
    const error = useRouteError()

    return (
        <main className='error-page'>
            <h1 className='error-page__title'>Oops!</h1>
            <p className='error-page__content'>Sorry, an unexpected error has occurred.</p>
            <p className='error-page__info'>
                <i>{error.statusText || error.message || error.data}</i>
            </p>
        </main>
    )
}

export default ErrorPage