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
        <div className='app'>
            {
                (auth.isLoggedIn && !isLoading) && (
                    auth.user.emailVerified ?
                        <>
                            <InternetConnection />
                            <div className='app__main'>
                                <Navbar />
                                <Outlet />
                            </div>
                        </>
                        :
                        <>
                            <InternetConnection />
                            <VerifyYourEmail />
                        </>
                )
            }
        </div>
    )
}

export default AuthRoute