import React, { useState } from 'react'
import Button from '../components/Button'
import axiosInstance from '../api/axios'
import useAuth from '../hooks/useAuth'
import PopupAlert from '../components/PopupAlert'

function VerifyYourEmail() {
    const { auth } = useAuth()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const [serverResponse, setServerResponse] = useState({
        title: null,
        body: null
    })

    const resend = async () => {
        try {
            await axiosInstance.get(`signup/verifyyouremail/resend/${auth.user.email}`)
            setServerResponse({
                title: "New link sent!",
                body: "A new link has been sent to your email. Verify your account by clicking the link."
            })
        } catch (err) {
            setServerResponse({
                title: "Server not responding",
                body: "We couldn't send a new link, please try again later."
            })
        } finally {
            setOpenPopupAlert(true)
        }
    }

    return (
        <div className='verify-your-email-container'>
            <h1 className='title'>Verify your email account</h1>
            <p className='body'>
                A link has been sent to your account to verify your email.
                Click resend if you haven't received the link.
            </p>
            <Button onClick={resend}>resend</Button>
            <PopupAlert
                title={serverResponse.title}
                body={serverResponse.body}
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
        </div>
    )
}

export default VerifyYourEmail