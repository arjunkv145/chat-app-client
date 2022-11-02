import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import VerifyYourEmail from '../Pages/VerifyYourEmail'
import Navbar from './Navbar'
import PageLoader from './PageLoader'

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
                    <PageLoader /> :
                    auth.isLoggedIn && (
                        auth.user.emailVerified ?
                            <div className='app-container'>
                                <Navbar />
                                <Outlet />
                            </div>
                            :
                            <VerifyYourEmail />
                    )
            }
        </>
    )
}

export default AuthRoute