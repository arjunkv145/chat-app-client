import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import PageLoader from '../components/PageLoader'
import PopupAlert from '../components/PopupAlert'

const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

function ForgotYourPassword() {
    const [email, setEmail] = useState('')
    const emailRef = useRef()
    const [emailError, setEmailError] = useState(null)
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const [serverResponse, setServerResponse] = useState({
        title: null,
        body: null
    })
    const { mutate, isFetching } = useMutation(
        email => axiosInstance.post('/password-reset/send-mail/', { email }),
        {
            onSuccess: () => setServerResponse({
                title: 'Password reset link sent!',
                body: 'A link has been sent to your mail to reset your password'
            }),
            onError: error => {
                if (error?.response?.data?.message === "User doesn't exist") {
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
            },
            onSettled: () => setOpenPopupAlert(true)
        }
    )

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
            mutate(email)
        }
    }

    useEffect(() => {
        emailRef.current.focus()
    }, [])

    return (
        <>
            <main className='form'>
                <h1 className='form__title'>Send password reset link</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form__input-wrapper">
                        <input
                            type="text"
                            placeholder="Email"
                            autoComplete="off"
                            value={email}
                            onChange={handleEmail}
                            ref={emailRef}
                            className="form__input"
                        />
                        {
                            emailError &&
                            <span
                                className="form__error-message"
                            >
                                {emailError}
                            </span>
                        }
                    </div>
                    <div className="form__btn-wrapper">
                        <button className='btn'>send</button>
                    </div>
                    <p className='form__message'>Click send again if you didn't receive the mail</p>
                </form>
            </main>
            <PopupAlert
                title={serverResponse.title}
                body={serverResponse.body}
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
            {isFetching && <PageLoader />}
        </>
    )
}

export default ForgotYourPassword