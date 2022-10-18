import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function Root() {
    const navigate = useNavigate()
    const { auth } = useAuth()
    return (
        <>
            {
                auth.initialLoadingState ?
                    'loading...' :
                    auth.isLoggedin ?
                        <>
                            <header>header</header>
                            <Outlet />
                            <footer>footer</footer>
                        </>
                        :
                        navigate('/login')
            }
        </>
    )
}

export default Root