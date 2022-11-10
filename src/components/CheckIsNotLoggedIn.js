import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import InternetConnection from './InternetConnection'

function CheckIsNotLoggedIn() {
    const { auth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const prevPath = location?.state?.prevPath ? location.state.prevPath : '/chat'
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (auth.isLoggedIn === true) {
            navigate(prevPath, { replace: true })
        }
        setIsLoading(false)
    }, [navigate, auth.isLoggedIn, prevPath])

    return (
        <>
            {
                (!auth.isLoggedIn && !isLoading)
                &&
                <>
                    <InternetConnection />
                    <Outlet />
                </>
            }
        </>
    )
}

export default CheckIsNotLoggedIn