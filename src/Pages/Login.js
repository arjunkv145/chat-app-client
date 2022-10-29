import "./sassStyles/login.scss"
import axiosInstance from "../api/axios"
import useAuth from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { useState, useEffect, useCallback, useRef } from "react"
import Button from "../components/Button"

function Login() {
    const { setAuth } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({ email: null, password: null })
    const [serverMessage, setServerMessage] = useState(null)
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

    const handleSubmit = async e => {
        e.preventDefault()
        isSubmittedOnce.current = true
        const submitStatus = handleErrors()
        if (submitStatus === true) {
            try {
                const res = await axiosInstance.post('login', { email, password })
                if (res.data.success === true) {
                    setAuth(prev => ({
                        ...prev,
                        user: res.data.user,
                        accessToken: res.data.accessToken,
                        isLoggedIn: true
                    }))
                } else {
                    setServerMessage(res.data.message)
                }
            } catch (err) {
                setServerMessage('Server not responding.')
            } finally {
                setTimeout(() => setServerMessage(null), 2000)
            }
        }
    }

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            handleErrors()
        }
    }, [email, password, handleErrors])

    return (
        <main className="login-container">
            <h1 className="title">Chat App</h1>
            {
                serverMessage &&
                <span className="server-message">
                    {serverMessage}
                </span>
            }
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Email"
                        autoComplete="off"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {
                        errors.email &&
                        <span className="input-error-message">
                            {errors.email}
                        </span>
                    }
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    {
                        errors.password &&
                        <span className="input-error-message">
                            {errors.password}
                        </span>
                    }
                </div>
                <div className="btn-login">
                    <Button>login</Button>
                </div>
            </form>
            <div className="link-container">
                <Link to='/forgottenpassword'>forgot your password?</Link>
            </div>
            <div className="btn-signup">
                <Link to='/signup'>
                    <Button>create an account</Button>
                </Link>
            </div>
        </main>
    );
}

export default Login