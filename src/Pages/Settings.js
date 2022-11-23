import React, { useState } from 'react'
import useAuth from "../hooks/useAuth"
import PopupAlert from '../components/PopupAlert'
import useSocket from '../hooks/useSocket'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

function Settings() {
    const { auth, setAuth } = useAuth()
    const socket = useSocket()
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()
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
    const { mutate: logoutRequest } = useMutation(
        () => axiosPrivate.post('logout'),
        {
            onSuccess,
            onError: () => setOpenPopupAlert(true)
        }
    )
    const { mutate: logoutAllRequest } = useMutation(
        () => axiosPrivate.post('logout/all'),
        {
            onSuccess,
            onError: () => setOpenPopupAlert(true)
        }
    )

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