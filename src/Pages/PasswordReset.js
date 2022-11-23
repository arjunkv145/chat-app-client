import { useMutation } from '@tanstack/react-query'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import PageLoader from '../components/PageLoader'
import PopupAlert from '../components/PopupAlert'

export const loader = async ({ request, params }) => {
    try {
        const { data } = await axiosInstance.get(`password-reset/is-expired/${params.passwordResetToken}`, { signal: request.signal })
        return { data }
    } catch (err) {
        throw new Response("Page Not Found", { status: 404 })
    }
}

function PasswordReset() {
    const { passwordResetToken } = useParams()
    const isSubmittedOnce = useRef(null)
    const [openPopupAlert, setOpenPopupAlert] = useState(false)


    const [formValues, setFormValues] = useState({
        password: '',
        confirmPassword: ''
    })

    const passwordRef = useRef()

    const [errors, setErrors] = useState({
        password: null,
        confirmPassword: null
    })

    const [serverResponse, setServerResponse] = useState({
        title: null,
        body: null
    })
    const { mutate, isFetching } = useMutation(
        values => axiosInstance.post('password-reset', values),
        {
            onSuccess: data => setServerResponse({
                title: "Success!",
                body: data.data.message
            }),
            onError: error => {
                if (error?.response?.data?.message === "You can't use the old password") {
                    setServerResponse({
                        title: "Password reset failed",
                        body: error.response.data.message
                    })
                } else if (error?.response?.data?.message === "This link is expired") {
                    setServerResponse({
                        title: "Password reset failed",
                        body: error.response.data.message
                    })
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
    const handleChange = e => setFormValues(prev => ({
        ...prev,
        [e.target.name]: e.target.value
    }))
    const checkErrors = useCallback(() => {
        let error = {
            password: '',
            confirmPassword: ''
        }
        if (formValues.password.trim() === '') {
            error.password = 'Password is required'
        }
        if (formValues.confirmPassword.trim() === '') {
            error.confirmPassword = 'You must re-enter your password'
        } else if (formValues.password.trim() !== formValues.confirmPassword.trim()) {
            error.confirmPassword = 'Both password must match'
        }
        setErrors(prev => ({ ...prev, ...error }))
    }, [formValues.password, formValues.confirmPassword])

    const handleSubmit = async e => {
        e.preventDefault()
        isSubmittedOnce.current = true
        checkErrors()
        if (errors.password === '' && errors.confirmPassword === '') {
            mutate({
                passwordResetToken,
                password: formValues.password
            })
        }
    }

    useEffect(() => {
        passwordRef.current.focus()
    }, [])

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            checkErrors()
        }
    }, [checkErrors])

    return (
        <>
            <main className="form">
                <h1 className="form__title">Reset your password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form__input-wrapper">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formValues.password}
                            ref={passwordRef}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {
                            errors.password &&
                            <span className="form__error-message">
                                {errors.password}
                            </span>
                        }
                    </div>
                    <div className="form__input-wrapper">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {
                            errors.confirmPassword &&
                            <span className="form__error-message">
                                {errors.confirmPassword}
                            </span>
                        }
                    </div>
                    <div className="form__btn-wrapper">
                        <button className='btn'>Reset</button>
                    </div>
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

export default PasswordReset