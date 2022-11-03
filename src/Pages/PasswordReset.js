import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import Button from '../components/Button'
import PageLoader from '../components/PageLoader'
import PopupAlert from '../components/PopupAlert'

export const loader = async ({ request, params }) => {
    try {
        const { data } = await axiosInstance.get(`passwordreset/isexpired/${params.passwordresettoken}`, { signal: request.signal })
        return { data }
    } catch (err) {
        throw new Response("Page Not Found", { status: 404 })
    }
}

function PasswordReset() {
    const { passwordresettoken } = useParams()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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
                setIsLoading(true)
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
                setIsLoading(false)
                setOpenPopupAlert(true)
            }
        }
    }

    return (
        <>
            <main className='form-container'>
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

export default PasswordReset