import React, { useState } from 'react'
import Button from '../components/Button'
import axiosInstance from '../api/axiosInstance'
import useAuth from '../hooks/useAuth'
import PopupAlert from '../components/PopupAlert'
import './sassStyles/verifyYourEmail.scss'
import PageLoader from '../components/PageLoader'

function VerifyYourEmail() {
    const { auth } = useAuth()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverResponse, setServerResponse] = useState({
        title: null,
        body: null
    })

    const resend = async () => {
        try {
            setIsLoading(true)
            await axiosInstance.get(`signup/verifyyouremail/resend/${auth.user.email}`)
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

    return (
        <>
            <main className='verify-your-email-container'>
                <h1 className='title'>Verify your email account</h1>
                <p className='body'>
                    A link has been sent to your account to verify your email.
                    Click resend if you haven't received the link.
                </p>
                <Button onClick={resend}>resend</Button>
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