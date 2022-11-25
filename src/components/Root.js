import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Outlet } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import useAuth from '../hooks/useAuth'
import InternetConnection from './InternetConnection'

function Root() {
    const { setAuth } = useAuth()
    const { isLoading } = useQuery({
        queryKey: ['is-logged-in'],
        queryFn: () => axiosInstance.get('/user'),
        onSuccess: data => setAuth({
            user: data?.data.user,
            accessToken: data?.data.accessToken,
            isLoggedIn: true,
            sessionId: data?.data.sessionId
        }),
    })

    return (
        !isLoading && (
            <>
                <InternetConnection />
                <Outlet />
            </>
        )
    )
}

export default Root