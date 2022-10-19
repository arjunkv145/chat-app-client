import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function Root() {
    const navigate = useNavigate()
    const { auth } = useAuth()
    console.log(useAuth())
    useEffect(() => {
        if (auth.initialLoadingState === false && auth.isLoggedIn === false) {
            navigate('/login')
        }
    }, [auth.initialLoadingState, auth.isLoggedIn, navigate])
    return (
        <>
            {
                auth.initialLoadingState ?
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