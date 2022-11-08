import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import InternetConnection from './InternetConnection'

function CheckIsNotLoggedIn() {
    const { auth } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (auth.isLoggedIn === true) {
            navigate('/chat', { replace: true })
        }
        setIsLoading(false)
    }, [navigate, auth.isLoggedIn])

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