import axiosInstance from "../api/axiosInstance"
import { useState, useRef, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import PopupAlert from "../components/PopupAlert"
import { useMutation, useQuery } from "@tanstack/react-query"
import PageLoader from "../components/PageLoader"

const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

function Signup() {
    const { setAuth } = useAuth()
    const isSubmittedOnce = useRef(null)
    const [formValues, setFormValues] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const userNameRef = useRef()
    const emailRef = useRef()

    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const { mutate, isFetching } = useMutation(
        formValues => axiosInstance.post('signup/new-user', formValues),
        {
            onSuccess: data => setAuth({
                user: data.data.user,
                accessToken: data.data.accessToken,
                isLoggedIn: true,
                sessionId: data.data.sessionId
            }),
            onError: () => setOpenPopupAlert(true)
        }
    )
    const { refetch: isEmailAvailableRequest, isLoading: emailIsLoading } = useQuery({
        queryKey: ['is-email-available', emailRef?.current?.value?.trim()],
        queryFn: () => axiosInstance.get(`signup/is-email-available/${emailRef?.current?.value?.trim()}`),
        onSuccess: data => {
            if (data.data.message === "Email is available") {
                setErrors(prev => ({ ...prev, email: '' }))
            } else if (data.data.message === "This email is already taken") {
                setErrors(prev => ({ ...prev, email: data.data.message }))
            }
        },
        onError: () => setErrors(prev => ({ ...prev, email: 'Server not responding' })),
        enabled: false,
    })
    const { refetch: isUserNameAvailableRequest, isLoading: userNameIsLoading } = useQuery({
        queryKey: ['is-username-available', userNameRef?.current?.value?.trim()],
        queryFn: () => axiosInstance.get(`signup/is-username-available/${userNameRef?.current?.value?.trim()}`),
        onSuccess: data => {
            if (data.data.message === "Username is available") {
                setErrors(prev => ({ ...prev, userName: '' }))
            } else if (data.data.message === "This username is already taken") {
                setErrors(prev => ({ ...prev, userName: data.data.message }))
            }
        },
        onError: () => setErrors(prev => ({ ...prev, userName: 'Server not responding' })),
        enabled: false,
    })

    const checkUserName = useCallback(() => {
        let error = ''
        if (formValues.userName.trim() === '') {
            error = 'Username is required'
        } else {
            isUserNameAvailableRequest()
        }
        setErrors(prev => ({ ...prev, userName: error }))
    }, [formValues.userName, isUserNameAvailableRequest])

    const checkEmail = useCallback(() => {
        let error = ''
        if (formValues.email.trim() === '') {
            error = 'Email is required'
        } else if (formValues.email.match(regexEmail) === null) {
            error = 'Email is invalid'
        } else {
            isEmailAvailableRequest()
        }
        setErrors(prev => ({ ...prev, email: error }))
    }, [formValues.email, isEmailAvailableRequest])

    const checkPassword = useCallback(() => {
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

    const handleChange = e => setFormValues(prev => ({
        ...prev,
        [e.target.name]: e.target.value
    }))

    const handleSubmit = e => {
        e.preventDefault()
        isSubmittedOnce.current = true

        checkUserName()
        checkEmail()
        checkPassword()

        if (!emailIsLoading && !userNameIsLoading) {
            if (
                errors.userName === '' &&
                errors.email === '' &&
                errors.password === '' &&
                errors.confirmPassword === ''
            ) {
                mutate(formValues)
            }
        }
    }

    useEffect(() => {
        userNameRef.current.focus()
    }, [])

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            checkUserName()
        }
    }, [formValues.userName, checkUserName])

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            checkEmail()
        }
    }, [formValues.email, checkEmail])

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            checkPassword()
        }
    }, [formValues.password, formValues.confirmPassword, checkPassword])

    return (
        <>
            <main className="form">
                <h1 className="form__title">Chat App</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form__input-wrapper">
                        <input
                            type="text"
                            name="userName"
                            placeholder="Enter your username"
                            autoComplete="off"
                            value={formValues.userName}
                            ref={userNameRef}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {
                            errors.userName &&
                            <span className="form__error-message" >
                                {errors.userName}
                            </span>
                        }
                    </div>
                    <div className="form__input-wrapper">
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter your email"
                            autoComplete="off"
                            value={formValues.email}
                            ref={emailRef}
                            onChange={handleChange}
                            className="form__input"
                        />
                        {
                            errors.email &&
                            <span className="form__error-message">
                                {errors.email}
                            </span>
                        }
                    </div>
                    <div className="form__input-wrapper">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formValues.password}
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
                        <button className="btn">signup</button>
                    </div>
                </form>
                <div className="form__link-wrapper">
                    <span className="form__link-login">
                        Already have an account?&nbsp;
                        <Link to='/'>
                            login
                        </Link>
                    </span>
                </div>
            </main>
            <PopupAlert
                title="Server not responding"
                body="The server is not responding at the moment, please try again later."
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
            {isFetching && <PageLoader />}
        </>
    )
}

export default Signup