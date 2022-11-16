import React, { useEffect } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import useAuth from '../hooks/useAuth'

export const loader = async ({ request }) => {
    try {
        const { data } = await axiosInstance.get('/user', { signal: request.signal })
        return data
    } catch (err) {
        const message = err?.response?.data?.message
        const data = { success: false, message: message ? message : 'Server not responding' }
        return data
    }
}

function Root() {
    const { setAuth } = useAuth()
    const data = useLoaderData()

    useEffect(() => {
        if (data.success === true) {
            setAuth({
                user: data.user,
                accessToken: data.accessToken,
                isLoggedIn: true,
                sessionId: data.sessionId
            })
        }
    }, [data.accessToken, data.success, data.user, data.sessionId, setAuth])

    return (
        <Outlet />
    )
}

export default Root