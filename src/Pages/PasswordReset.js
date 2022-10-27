import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axios'

function PasswordReset() {
    const { passwordresettoken } = useParams()
    const [loading, setLoading] = useState(true)
    const [isExpired, setIsExpired] = useState(false)

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const passwordRef = useRef()
    const confirmPasswordRef = useRef()

    const [errors, setErrors] = useState({
        password: null,
        confirmPassword: null
    })

    const [serverMessage, setServerMessage] = useState(null)

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
                setServerMessage(res.data.message)
            } catch (err) {
                setServerMessage('Server not responding.')
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const isTokenValid = async () => {
            try {
                const res = await axiosInstance.get(`passwordreset/isexpired/${passwordresettoken}`, { signal: controller.signal })

                if (res.data.isexpired === true) {
                    isMounted && setIsExpired(true)
                } else {
                    isMounted && setIsExpired(false)
                }
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
        <div>
            {
                loading ? 'loading' : (
                    isExpired ? 'This link is expired' :
                        <>
                            {serverMessage && serverMessage}
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={handlePassword}
                                    ref={passwordRef}
                                />
                                <span>{errors.password && errors.password}</span>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPassword}
                                    ref={confirmPasswordRef}
                                />
                                <span>{errors.confirmPassword && errors.confirmPassword}</span>
                                <button>send</button>
                            </form>
                        </>
                )
            }
        </div>
    )
}

export default PasswordReset