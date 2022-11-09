import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import VerifyYourEmail from '../Pages/VerifyYourEmail'
import InternetConnection from './InternetConnection'
import Navbar from './Navbar'

function AuthRoute() {
    const { auth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (auth.isLoggedIn === false) {
            navigate('/', { state: { prevPath: currentPath }, replace: true })
        }
        setIsLoading(false)
    }, [currentPath, navigate, auth.isLoggedIn])

    return (
        <div className='app-container'>
            {
                (auth.isLoggedIn && !isLoading) && (
                    auth.user.emailVerified ?
                        <>
                            <InternetConnection />
                            <div className='app'>
                                <Navbar />
                                <Outlet />
                            </div>
                        </>
                        :
                        <>
                            <InternetConnection />
                            <div className='app'>
                                <VerifyYourEmail />
                            </div>
                        </>
                )
            }
        </div>
    )
}

export default AuthRoute