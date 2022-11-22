import React, { useState } from 'react'
import useAuth from "../hooks/useAuth"
import axiosInstance from "../api/axiosInstance"
import PopupAlert from '../components/PopupAlert'
import useSocket from '../hooks/useSocket'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

function Settings() {
    const { auth, setAuth } = useAuth()
    const socket = useSocket()
    const navigate = useNavigate()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const onSuccess = () => {
        socket.emit('logout', {
            room: auth.user.userName,
            sessionId: auth.sessionId
        })
        setAuth({
            user: {},
            accessToken: null,
            isLoggedIn: false,
            sessionId: null
        })
        navigate('/')
    }
    const { refetch: logoutRequest } = useQuery({
        queryKey: ['logout'],
        queryFn: () => axiosInstance.get('logout'),
        onSuccess,
        onError: () => setOpenPopupAlert(true),
        enabled: false,
        retry: 0
    })
    const { refetch: logoutAllRequest } = useQuery({
        queryKey: ['logoutAll'],
        queryFn: () => axiosInstance.get('logout/all'),
        onSuccess,
        onError: () => setOpenPopupAlert(true),
        enabled: false,
        retry: 0
    })

    return (
        <>
            <main className='settings'>
                <button className='btn' onClick={logoutRequest}>logout</button>
                <button className='btn' onClick={logoutAllRequest}>logout of all devices</button>
            </main>
            <PopupAlert
                title="Can't log out"
                body="The server is not responding at the moment, please try again later."
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
        </>
    )
}

export default Settings