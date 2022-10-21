import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function Group() {
    const { auth, initialLoadingState } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if (initialLoadingState === false && auth.isLoggedIn === false) {
            navigate('/')
        }
    }, [initialLoadingState, auth.isLoggedIn, navigate])

    return (
        <div>
            Group
            <Link to='/chat'>go to groups page</Link>
        </div>
    )
}

export default Group