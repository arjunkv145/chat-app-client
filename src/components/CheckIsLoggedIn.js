import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function CheckIsLoggedIn() {
    const { auth, initialLoadingState } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const prevPath = location?.state?.prevPath ? location.state.prevPath : '/chat'

    useEffect(() => {
        if (initialLoadingState === false && auth.isLoggedIn === true) {
            navigate(prevPath, { replace: true })
        }
    }, [auth.isLoggedIn, initialLoadingState, navigate, prevPath])

    return (
        <>
            {
                initialLoadingState ?
                    <div className='loading-animation'></div> :
                    !auth.isLoggedIn && <Outlet />
            }
        </>
    )
}

export default CheckIsLoggedIn