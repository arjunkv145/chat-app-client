import React, { useRef, useState } from 'react'
import axiosInstance from '../api/axios'

const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

function ForgottenPassword() {
    const [email, setEmail] = useState('')
    const emailRef = useRef()
    const [emailError, setEmailError] = useState(null)
    const [serverMessage, setServerMessage] = useState(null)

    const handleEmail = () => {
        let emailErrorMessage = null
        const { value } = emailRef.current

        if (value.trim() === '') {
            emailErrorMessage = 'Email is required'
        } else if (email.match(regexEmail) === null) {
            emailErrorMessage = 'Email is not valid'
        }
        setEmailError(emailErrorMessage)
        setEmail(value)
        return emailErrorMessage
    }
    const handleSubmit = async e => {
        e.preventDefault()
        const submitStatus = handleEmail()
        if (submitStatus === null) {
            try {
                const res = await axiosInstance.get(`/passwordreset/sendmail/${email}`)
                setServerMessage(res.data.message)
            } catch (err) {
                setServerMessage("Server not responding")
                setTimeout(() => setServerMessage(null), 2000)
            }
        }
    }

    return (
        <div>
            <span>{serverMessage && serverMessage}</span>
            <form onSubmit={handleSubmit}>
                <input type="text" value={email} onChange={handleEmail} ref={emailRef} />
                <span>{emailError && emailError}</span>
                <button>send</button>
                <p>click send again if you didnt receive the mail</p>
            </form>
        </div>
    )
}

export default ForgottenPassword