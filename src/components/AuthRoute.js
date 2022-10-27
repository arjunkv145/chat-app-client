import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import VerifyYourEmail from '../Pages/VerifyYourEmail'

function AuthRoute() {
    const { auth, initialLoadingState } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    useEffect(() => {
        if (initialLoadingState === false && auth.isLoggedIn === false) {
            navigate('/', { state: { prevPath: currentPath }, replace: true })
        }
    }, [auth.isLoggedIn, initialLoadingState, navigate, currentPath])
    return (
        <>
            {
                initialLoadingState ?
                    'loading' :
                    auth.isLoggedIn && (
                        auth.emailVerified ?
                            <>
                                <header>header</header>
                                <Outlet />
                                <footer>footer</footer>
                            </> :
                            <>
                                <VerifyYourEmail />
                            </>
                    )
            }
        </>
    )
}

export default AuthRoute