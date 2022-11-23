import axiosInstance from "../api/axiosInstance"
import useAuth from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { useState, useEffect, useCallback, useRef } from "react"
import PopupAlert from "../components/PopupAlert"
import PageLoader from "../components/PageLoader"
import { useMutation } from "@tanstack/react-query"

function Login() {
    const { setAuth } = useAuth()

    const [formValues, setFormValues] = useState({ userNameOrEmail: '', password: '' })
    const [errors, setErrors] = useState({ userNameOrEmail: null, password: null })
    const isSubmittedOnce = useRef(null)
    const userNameOrEmailRef = useRef(null)
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const { mutate, isFetching } = useMutation(
        formValues => axiosInstance.post('login', formValues),
        {
            onSuccess: data => setAuth({
                user: data.data.user,
                accessToken: data.data.accessToken,
                isLoggedIn: true,
                sessionId: data.data.sessionId
            }),
            onError: error => {
                if (error?.response?.data?.message === "User doesn't exist") {
                    setErrors(prev => ({
                        ...prev,
                        userNameOrEmail: "The username or email you provided doesn't match any accounts",
                    }))
                } else if (error?.response?.data?.message === "Wrong password") {
                    setErrors(prev => ({
                        ...prev,
                        password: "The password you entered is incorrect",
                    }))
                } else {
                    setOpenPopupAlert(true)
                }
            }
        }
    )
    const handleChange = e => setFormValues(prev => ({
        ...prev,
        [e.target.name]: e.target.value
    }))
    const checkErrors = useCallback(() => {
        const error = {
            userNameOrEmail: '',
            password: ''
        }
        if (formValues.userNameOrEmail.trim() === '') {
            error.userNameOrEmail = 'Username or email is required'
        }
        if (formValues.password.trim() === '') {
            error.password = 'Password is required'
        }
        setErrors(prev => ({ ...prev, ...error }))
    }, [formValues.userNameOrEmail, formValues.password])

    const handleSubmit = async e => {
        e.preventDefault()
        isSubmittedOnce.current = true
        checkErrors()
        if (errors.userNameOrEmail === '' && errors.password === '') {
            mutate(formValues)
        }
    }

    useEffect(() => {
        userNameOrEmailRef.current.focus()
    }, [])

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            checkErrors()
        }
    }, [checkErrors])

    return (
        <>
            <main className="form">
                <h1 className="form__title">Chat App</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form__input-wrapper">
                        <input
                            type="text"
                            name="userNameOrEmail"
                            placeholder="Username or email"
                            autoComplete="off"
                            value={formValues.userNameOrEmail}
                            onChange={handleChange}
                            className="form__input"
                            ref={userNameOrEmailRef}
                        />
                        {
                            errors.userNameOrEmail &&
                            <span className="form__error-message">
                                {errors.userNameOrEmail}
                            </span>
                        }
                    </div>
                    <div className="form__input-wrapper">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
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
                    <div className="form__btn-wrapper">
                        <button className="btn">login</button>
                    </div>
                </form>
                <div className="form__link-wrapper">
                    <span className="form__link-forgot-your-password">
                        <Link to='/forgot-your-password'>forgot your password?</Link>
                    </span>
                    <span className="form__link-signup">
                        Don't have an account?&nbsp;
                        <Link to='/signup'>
                            sign up
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

export default Login