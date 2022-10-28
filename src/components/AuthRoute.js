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
                    <div className='loading-animation'></div> :
                    auth.isLoggedIn && (
                        auth.emailVerified ?
                            <div className='app-container'>
                                <header>header</header>
                                <Outlet />
                                <footer>footer</footer>
                            </div> : <VerifyYourEmail />
                    )
            }
        </>
    )
}

export default AuthRoute