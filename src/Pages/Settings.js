import React, { useState } from 'react'
import useAuth from "../hooks/useAuth"
import axiosInstance from "../api/axiosInstance"
import { useNavigate } from "react-router-dom"
import PopupAlert from '../components/PopupAlert'
import Button from '../components/Button'

function Settings() {
    const { setAuth } = useAuth()
    const navigate = useNavigate()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)

    const logout = async () => {
        try {
            await axiosInstance.get('logout')
            setAuth(prev => ({
                ...prev,
                user: null,
                accessToken: null,
                isLoggedIn: false
            }))
            navigate('/')
        } catch (err) {
            setOpenPopupAlert(true)
        }
    }

    return (
        <>
            <main className='settings'>
                <Button onClick={logout}>Logout</Button>
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