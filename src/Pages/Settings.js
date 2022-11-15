import React, { useState } from 'react'
import useAuth from "../hooks/useAuth"
import axiosInstance from "../api/axiosInstance"
import PopupAlert from '../components/PopupAlert'
import Button from '../components/Button'
import useSocket from '../hooks/useSocket'
import { useNavigate } from 'react-router-dom'

function Settings() {
    const { auth, setAuth } = useAuth()
    const socket = useSocket()
    const navigate = useNavigate()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)

    const logout = async () => {
        try {
            await axiosInstance.get('logout')
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
        } catch (err) {
            setOpenPopupAlert(true)
        }
    }
    const logoutAll = async () => {
        try {
            await axiosInstance.get('logout/all')
            socket.emit('logoutAll', {
                room: auth.user.userName
            })
            setAuth({
                user: {},
                accessToken: null,
                isLoggedIn: false,
                sessionId: null
            })
            navigate('/')
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