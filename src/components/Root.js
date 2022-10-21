import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function Root() {
    const navigate = useNavigate()
    const { auth, initialLoadingState } = useAuth()
    console.log(useAuth())
    useEffect(() => {
        if (initialLoadingState === false && auth.isLoggedIn === false) {
            navigate('/')
        }
    }, [initialLoadingState, auth.isLoggedIn, navigate])
    return (
        <>
            {
                initialLoadingState ?
                    'loading...' :
                    <>
                        <header>header</header>
                        <Outlet />
                        <footer>footer</footer>
                    </>
            }
        </>
    )
}

export default Root