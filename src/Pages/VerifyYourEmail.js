import React, { useState } from 'react'
import Button from '../components/Button'
import axiosInstance from '../api/axios'
import useAuth from "../hooks/useAuth"

function VerifyYourEmail() {
    const { auth } = useAuth()
    const [serverMessage, setServerMessage] = useState(null)

    const resend = async () => {
        try {
            const res = await axiosInstance.get(`signup/verifyyouremail/resend/${auth.user.email}`)
            setServerMessage(res.data.message)
        } catch (err) {
            setServerMessage("Server not responding")
        } finally {
            setTimeout(() => setServerMessage(null), 2000)
        }
    }

    return (
        <div>
            <span>{serverMessage}</span>
            <p>
                A link has been sent to your account to verify your email.
                Click resend if you haven't received the link
            </p>
            <Button onClick={resend}>resend</Button>
        </div>
    )
}

export default VerifyYourEmail