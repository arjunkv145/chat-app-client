import React, { useRef, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import Button from '../components/Button'
import PageLoader from '../components/PageLoader'
import PopupAlert from '../components/PopupAlert'

const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

function ForgottenPassword() {
    const [email, setEmail] = useState('')
    const emailRef = useRef()
    const [emailError, setEmailError] = useState(null)
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverResponse, setServerResponse] = useState({
        title: null,
        body: null
    })

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
                setIsLoading(true)
                await axiosInstance.get(`/passwordreset/sendmail/${email}`)
                setServerResponse({
                    title: 'Password reset link sent!',
                    body: 'A link has been sent to your mail to reset your password'
                })
            } catch (err) {
                if (err?.response?.data?.message === "User doesn't exist") {
                    setServerResponse(({
                        title: "Account doesn't exist",
                        body: "The email you provided doesn't match any accounts",
                    }))
                } else {
                    setServerResponse({
                        title: "Server not responding",
                        body: "The server is not responding at the moment, please try again later."
                    })
                }
            } finally {
                setIsLoading(false)
                setOpenPopupAlert(true)
            }
        }
    }

    return (
        <>
            <main className='form-container'>
                <h1 className='title'>Send password reset link</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Email"
                            autoComplete="off"
                            value={email}
                            onChange={handleEmail}
                            ref={emailRef}
                        />
                        {
                            emailError &&
                            <span className="input-error-message">
                                {emailError}
                            </span>
                        }
                    </div>
                    <div className="btn-submit">
                        <Button>send</Button>
                    </div>
                    <p className='general-message'>Click send again if you didn't receive the mail</p>
                </form>
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

export default ForgottenPassword