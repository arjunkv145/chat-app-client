import "./sassStyles/login.scss"
import axiosInstance from "../api/axios"
import useAuth from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { useState, useEffect, useCallback, useRef } from "react"

function Login() {
    const { setAuth } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({ email: null, password: null })
    const [serverError, setServerError] = useState(null)
    const isSubmittedOnce = useRef(false)

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

    const handleSubmit = e => {
        e.preventDefault()
        isSubmittedOnce.current = true
        const submitStatus = handleErrors()
        if (submitStatus === true) {
            setServerError(null)
            axiosInstance.post('login', { email, password })
                .then((res) => {
                    if (res.data.success === true) {
                        setAuth(prev => ({
                            ...prev,
                            user: res.data.user,
                            accessToken: res.data.accessToken,
                            isLoggedIn: true,
                            emailVerified: res.data.user.emailVerified
                        }))
                    } else if (res.data.success === false) {
                        setServerError(res.data.message)
                    }
                })
                .catch(err => {
                    setServerError('Server not responding.')
                    setTimeout(() => setServerError(null), 2000)
                })
        }
    }

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            handleErrors()
        }
    }, [email, password, handleErrors])

    return (
        <div className="form-container">
            <span className="error-message">
                {serverError && serverError}
            </span>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <span className="error-message">
                        {errors.email && errors.email}
                    </span>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <span className="error-message">
                        {errors.password && errors.password}
                    </span>
                </div>
                <button>Login</button>
            </form>
            <Link to='/forgottenpassword'>forgot password</Link>
            <Link to='/signup'>create and account</Link>
        </div>
    );
}

export default Login