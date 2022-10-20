import "./sassStyles/login.scss"
import axios from "../api/axios"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback, useRef } from "react"

function Login() {
    const { auth, setAuth } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({ email: null, password: null })
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

    useEffect(() => {
        if (auth.initialLoadingState === false && auth.isLoggedIn === true) {
            navigate('/')
        }
    }, [auth.initialLoadingState, auth.isLoggedIn, navigate])

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            handleErrors()
        }
    }, [email, password, handleErrors])

    const handleSubmit = e => {
        e.preventDefault()
        isSubmittedOnce.current = true
        const submitStatus = handleErrors()
        if (submitStatus === true) {
            axios.post('login', { email, password })
                .then((res) => {
                    console.log(res)
                    setAuth(prev => ({
                        ...prev,
                        user: res.data.user,
                        accessToken: res.data.accessToken,
                        isLoggedIn: true
                    }))
                })
                .catch(err => console.log(err))
        }
    }
    return (
        <div className="login-page">
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
            <Link to='/register'>Register</Link>
        </div>
    );
}

export default Login