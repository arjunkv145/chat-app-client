import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function AuthRoute() {
    const { auth, initialLoadingState } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname
    const prevPath = location?.state?.prevPath ? location.state.prevPath : '/chat'

    useEffect(() => {
        if (initialLoadingState === false && auth.isLoggedIn === false) {
            if (currentPath !== '/' && currentPath !== '/register') {
                navigate('/', { state: { prevPath: currentPath }, replace: true })
            }
        } else if (initialLoadingState === false && auth.isLoggedIn === true) {
            if (currentPath === '/' || currentPath === '/register') {
                navigate(prevPath, { replace: true })
            }
        }
    }, [auth.isLoggedIn, initialLoadingState, location.pathname, navigate, currentPath, prevPath])

    return (
        <>
            {
                initialLoadingState ? 'loading' : 
                (
                    ( ( currentPath === '/' || currentPath === '/register' ) && auth.isLoggedIn === false )
                    ||
                    ( currentPath !== '/' && currentPath !== '/register' && auth.isLoggedIn === true )
                ) ? <Outlet /> : ''
            }
        </>
    )
}

export default AuthRoute