import React, { useState } from 'react'
import useAuth from "../hooks/useAuth"
import axiosInstance from "../api/axiosInstance"
import PopupAlert from '../components/PopupAlert'
import Button from '../components/Button'
import useSocket from '../hooks/useSocket'

function Settings() {
    const { auth, setAuth } = useAuth()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const socket = useSocket()

    const logout = async () => {
        try {
            await axiosInstance.get('logout')
            socket.emit('logout', {
                room: `${auth.user.userName} ${auth.sessionId}`
            })
            socket.disconnect()
            setAuth(prev => ({
                ...prev,
                user: null,
                accessToken: null,
                isLoggedIn: false,
                sessionId: null
            }))
        } catch (err) {
            setOpenPopupAlert(true)
        }
    }
    const logoutAll = async () => {
        try {
            await axiosInstance.get('logout/all')
            socket.emit('logoutAll', {
                room: `${auth.user.userName} ${auth.sessionId}`
            })
            socket.disconnect()
            setAuth(prev => ({
                ...prev,
                user: null,
                accessToken: null,
                isLoggedIn: false,
                sessionId: null
            }))
        } catch (err) {
            setOpenPopupAlert(true)
        }
    }

    return (
        <>
            <main className='settings'>
                <Button onClick={logout}>logout</Button>
                <Button onClick={logoutAll}>logout of all devices</Button>
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