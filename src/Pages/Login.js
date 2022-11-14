import axiosInstance from "../api/axiosInstance"
import useAuth from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { useState, useEffect, useCallback, useRef } from "react"
import Button from "../components/Button"
import PopupAlert from "../components/PopupAlert"
import PageLoader from "../components/PageLoader"
import { v4 as uuidv4 } from 'uuid'

function Login() {
    const { setAuth } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errors, setErrors] = useState({ email: null, password: null })
    const isSubmittedOnce = useRef(false)
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleErrors = useCallback(() => {
        let emailErrorMessage = null
        let passwordErrorMessage = null
        const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

        if (email.trim() === '') {
            emailErrorMessage = 'Email is required'
        } else if (email.match(regexEmail) === null) {
            emailErrorMessage = 'Email is not valid'
        }

        if (password.trim() === '') {
            passwordErrorMessage = 'Password is required'
        }
        setErrors(prev => ({
            ...prev,
            email: emailErrorMessage,
            password: passwordErrorMessage
        }))
        return (emailErrorMessage === null && passwordErrorMessage === null) ? true : false
    }, [email, password])

    const handleSubmit = async e => {
        e.preventDefault()
        isSubmittedOnce.current = true
        const submitStatus = handleErrors()
        if (submitStatus === true) {
            try {
                setIsLoading(true)
                const res = await axiosInstance.post('login', { email, password })
                setAuth(prev => ({
                    ...prev,
                    user: res.data.user,
                    accessToken: res.data.accessToken,
                    isLoggedIn: true,
                    sessionId: uuidv4()
                }))
            } catch (err) {
                if (err?.response?.data?.message === "User doesn't exist") {
                    setErrors(prev => ({
                        ...prev,
                        email: "The email you provided doesn't match any accounts",
                    }))
                } else if (err?.response?.data?.message === "Wrong password") {
                    setErrors(prev => ({
                        ...prev,
                        password: "The password you entered is incorrect",
                    }))
                } else {
                    setOpenPopupAlert(true)
                }
            } finally {
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            handleErrors()
        }
    }, [email, password, handleErrors])

    return (
        <>
            <main className="form">
                <h1 className="form__title">Chat App</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form__input-wrapper">
                        <input
                            type="text"
                            placeholder="Email"
                            autoComplete="off"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="form__input"
                        />
                        {
                            errors.email &&
                            <span
                                className="form__error-message"
                            >
                                {errors.email}
                            </span>
                        }
                    </div>
                    <div className="form__input-wrapper">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="form__input"
                        />
                        {
                            errors.password &&
                            <span
                                className="form__error-message"
                            >
                                {errors.password}
                            </span>
                        }
                    </div>
                    <div className="form__btn-wrapper">
                        <Button>login</Button>
                    </div>
                </form>
                <div className="form__link-wrapper">
                    <span className="form__link-forgot-your-password">
                        <Link to='/forgotyourpassword'>forgot your password?</Link>
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
            {isLoading && <PageLoader />}
        </>
    )
}

export default Login