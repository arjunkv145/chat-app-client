import React, { useState } from 'react'
import Button from '../components/Button'
import axiosInstance from '../api/axiosInstance'
import useAuth from '../hooks/useAuth'
import PopupAlert from '../components/PopupAlert'
import PageLoader from '../components/PageLoader'
import { Link } from 'react-router-dom'
import useSocket from '../hooks/useSocket'

function VerifyYourEmail() {
    const { auth, setAuth } = useAuth()
    const socket = useSocket()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverResponse, setServerResponse] = useState({
        title: null,
        body: null
    })

    const resend = async () => {
        try {
            setIsLoading(true)
            await axiosInstance.get(`signup/verify-your-email/resend/${auth.user.email}`)
            setServerResponse({
                title: "New link sent!",
                body: "A new link has been sent to your email. Verify your account by clicking the link."
            })
        } catch (err) {
            if (err?.response?.status === 422) {
                setServerResponse({
                    title: "Your email is already verified",
                    body: "You can reload the page to use the app."
                })
            } else {
                setServerResponse({
                    title: "Server not responding",
                    body: "We couldn't send a new link, please try again later."
                })
            }
        } finally {
            setIsLoading(false)
            setOpenPopupAlert(true)
        }
    }
    const logout = async e => {
        e.preventDefault()
        try {
            setIsLoading(true)
            await axiosInstance.get('logout')
            socket.disconnect()
            setIsLoading(false)
            setAuth({
                user: {},
                accessToken: null,
                isLoggedIn: false,
                sessionId: null
            })
        } catch (err) {
            setIsLoading(false)
            setServerResponse({
                title: "Can't log out",
                body: "The server is not responding at the moment, please try again later."
            })
            setOpenPopupAlert(true)
        }
    }

    return (
        <>
            <main className='verify-your-email'>
                <h1 className='verify-your-email__title'>Verify your email account</h1>
                <p className='verify-your-email__content'>
                    A link has been sent to your account to verify your email.
                    Click resend if you haven't received the link.
                </p>
                <Button onClick={resend}>resend</Button>
                <p className='verify-your-email__logout'>
                    Used a wrong email to signup? logout and signup with a new email.&nbsp;
                    <Link to='#' onClick={logout}>logout</Link>
                </p>
            </main>
            <PopupAlert
                title={serverResponse.title}
                body={serverResponse.body}
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
            {isLoading && <PageLoader />}
        </>
    )
}

export default VerifyYourEmail