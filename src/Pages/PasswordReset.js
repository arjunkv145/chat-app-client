import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axios'
import Button from '../components/Button'
import PageLoader from '../components/PageLoader'
import PopupAlert from '../components/PopupAlert'
import ErrorPage from './ErrorPage'

function PasswordReset() {
    const { passwordresettoken } = useParams()
    const [loading, setLoading] = useState(true)
    const [isExpired, setIsExpired] = useState(false)
    const [openPopupAlert, setOpenPopupAlert] = useState(false)

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const passwordRef = useRef()
    const confirmPasswordRef = useRef()

    const [errors, setErrors] = useState({
        password: null,
        confirmPassword: null
    })

    const [serverResponse, setServerResponse] = useState({
        title: null,
        body: null
    })

    const handlePassword = () => {
        let passwordErrorMessage = null
        const { value } = passwordRef.current
        if (value.trim() === '') {
            passwordErrorMessage = 'Password is required'
        } else if (value.trim().length < 8) {
            passwordErrorMessage = 'Password must be atleast 8 characters'
        }
        setPassword(value)
        setErrors(prev => ({ ...prev, password: passwordErrorMessage }))
        handleConfirmPassword()
        return passwordErrorMessage === null ? true : false
    }

    const handleConfirmPassword = () => {
        let confirmPasswordErrorMessage = null
        const { value } = confirmPasswordRef.current
        if (value.trim() !== passwordRef.current.value.trim()) {
            confirmPasswordErrorMessage = 'Both passwords must match'
        }
        setConfirmPassword(value)
        setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordErrorMessage }))
        return confirmPasswordErrorMessage === null ? true : false
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const submitStatus = (
            handlePassword() && handleConfirmPassword()
        ) ? true : false
        if (submitStatus === true) {
            try {
                const res = await axiosInstance.post('passwordreset', { passwordResetToken: passwordresettoken, password: password })
                setServerResponse({
                    title: "Success!",
                    body: res.data.message
                })
            } catch (err) {
                if (err?.response?.data?.message === "You can't use the old password") {
                    setServerResponse({
                        title: "Passwrod reset failed",
                        body: err.response.data.message
                    })
                } else if (err?.response?.data?.message === "This link is expired") {
                    setServerResponse({
                        title: "Passwrod reset failed",
                        body: err.response.data.message
                    })
                } else {
                    setServerResponse({
                        title: "Server not responding",
                        body: "The server is not responding at the moment, please try again later."
                    })
                }
            } finally {
                setOpenPopupAlert(true)
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const isTokenValid = async () => {
            try {
                await axiosInstance.get(`passwordreset/isexpired/${passwordresettoken}`, { signal: controller.signal })
            } catch (err) {
                isMounted && setIsExpired(true)
            } finally {
                isMounted && setLoading(false)
            }
        }

        isTokenValid()
        return () => {
            controller.abort()
            isMounted = false
        }
    }, [passwordresettoken])

    return (
        <>
            {
                loading ? <PageLoader /> : (
                    isExpired ? <ErrorPage /> :
                        <div className='form-container'>
                            <h1 className="title">Reset your password</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="input-container">
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        ref={passwordRef}
                                        onChange={handlePassword}
                                    />
                                    {
                                        errors.password &&
                                        <span className="input-error-message">
                                            {errors.password}
                                        </span>
                                    }
                                </div>
                                <div className="input-container">
                                    <input
                                        type="password"
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        ref={confirmPasswordRef}
                                        onChange={handleConfirmPassword}
                                    />
                                    {
                                        errors.confirmPassword &&
                                        <span className="input-error-message">
                                            {errors.confirmPassword}
                                        </span>
                                    }
                                </div>
                                <div className="btn-submit">
                                    <Button>Reset</Button>
                                </div>
                            </form>
                            <PopupAlert
                                title={serverResponse.title}
                                body={serverResponse.body}
                                openPopupAlert={openPopupAlert}
                                setOpenPopupAlert={setOpenPopupAlert}
                            />
                        </div>
                )
            }
        </>
    )
}

export default PasswordReset