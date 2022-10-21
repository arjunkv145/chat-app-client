import "./sassStyles/register.scss"
import axios from "../api/axios"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

function Register() {
    const { setAuth } = useAuth()
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const userNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const [errors, setErrors] = useState({
        userName: null,
        email: null,
        password: null,
        confirmPassword: null
    })
    const [serverError, setServerError] = useState(null)
    const [credentialsAvailable, setCredentialsAvailable] = useState({
        userName: null,
        email: null
    })
    const [credentialsAvailableLoadingState, setCredentialsAvailableLoadingState] = useState({
        userName: false,
        email: false
    })

    const handleUserName = () => {
        let userNameErrorMessage = null
        const { value } = userNameRef.current
        if (value.trim() === '') {
            userNameErrorMessage = 'UserName is required'
        }
        setUserName(value)
        setErrors(prev => ({ ...prev, userName: userNameErrorMessage }))
        return userNameErrorMessage === null ? true : false
    }

    const handleEmail = () => {
        let emailErrorMessage = null
        const { value } = emailRef.current
        if (value.trim() === '') {
            emailErrorMessage = 'Email is required'
        } else if (value.match(regexEmail) === null) {
            emailErrorMessage = 'Email is not valid'
        }
        setEmail(value)
        setErrors(prev => ({ ...prev, email: emailErrorMessage }))
        return emailErrorMessage === null ? true : false
    }

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

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true
        isMounted && setCredentialsAvailable(prev => ({ ...prev, userName: null }))
        isMounted && setCredentialsAvailableLoadingState(prev => ({ ...prev, userName: false }))
        const fetchData = async () => {
            let userNameAvailableMessage = null
            try {
                isMounted && setCredentialsAvailableLoadingState(prev => ({ ...prev, userName: true }))
                const res = await axios.get(`check_username/${userName.trim()}`, { signal: controller.signal })
                if (res.data.message === "Username is available") {
                    userNameAvailableMessage = res.data.message
                } else if (res.data.message === "Username is not available") {
                    userNameAvailableMessage = res.data.message
                }
            } catch (err) {
                userNameAvailableMessage = "server not responding"
            } finally {
                isMounted && setCredentialsAvailable(prev => ({ ...prev, userName: userNameAvailableMessage }))
                isMounted && setCredentialsAvailableLoadingState(prev => ({ ...prev, userName: false }))
            }
        }

        if (userName.trim() !== '') {
            fetchData()
        }

        return () => {
            controller.abort()
            isMounted = false
        }
    }, [userName])

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true
        isMounted && setCredentialsAvailable(prev => ({ ...prev, email: null }))
        isMounted && setCredentialsAvailableLoadingState(prev => ({ ...prev, email: false }))
        const fetchData = async () => {
            let emailAvailableMessage = null
            try {
                isMounted && setCredentialsAvailableLoadingState(prev => ({ ...prev, email: true }))
                const res = await axios.get(`check_email/${email.trim()}`)
                if (res.data.message === "Email is available") {
                    emailAvailableMessage = res.data.message
                } else if (res.data.message === "Email is not available") {
                    emailAvailableMessage = res.data.message
                }
            } catch (err) {
                emailAvailableMessage = "server not responding"
            } finally {
                isMounted && setCredentialsAvailable(prev => ({ ...prev, email: emailAvailableMessage }))
                isMounted && setCredentialsAvailableLoadingState(prev => ({ ...prev, email: false }))
            }
        }
        if (email.trim() !== '' && email.match(regexEmail) !== null) {
            fetchData()
        }

        return () => {
            controller.abort()
            isMounted = false
        }
    }, [email])

    const handleSubmit = e => {
        e.preventDefault()
        const submitStatus = (
            handleUserName() &&
            handleEmail() &&
            handlePassword() &&
            handleConfirmPassword() &&
            credentialsAvailable.userName === 'Username is available' &&
            credentialsAvailable.email === 'Email is available'
        ) ? true : false
        if (submitStatus === true) {
            axios.post('register', { userName, email, password })
                .then((res) => {
                    setAuth(prev => ({
                        ...prev,
                        user: res.data.user,
                        accessToken: res.data.accessToken,
                        isLoggedIn: true
                    }))
                })
                .catch(err => {
                    setServerError('Server not responding.')
                })
        }
    }
    return (
        <div className="register-page">
            <form onSubmit={handleSubmit}>
                <span className="error-message">
                    {serverError && serverError}
                </span>
                <div>
                    <label htmlFor="userName">User name</label>
                    <input
                        type="text"
                        name="userName"
                        id="userName"
                        value={userName}
                        ref={userNameRef}
                        onChange={handleUserName}
                    />
                    <span className="error-message">{errors.userName && errors.userName}</span>
                    <span className="error-message">
                        {credentialsAvailable.userName && credentialsAvailable.userName}
                    </span>
                    <span className="error-message">
                        {credentialsAvailableLoadingState.userName && 'Loading...'}
                    </span>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        value={email}
                        ref={emailRef}
                        onChange={handleEmail}
                    />
                    <span className="error-message">{errors.email && errors.email}</span>
                    <span className="error-message">
                        {credentialsAvailable.email && credentialsAvailable.email}
                    </span>
                    <span className="error-message">
                        {credentialsAvailableLoadingState.email && 'Loading...'}
                    </span>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        ref={passwordRef}
                        onChange={handlePassword}
                    />
                    <span className="error-message">{errors.password && errors.password}</span>
                </div>
                <div>
                    <label htmlFor="cpassword">Confirm password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={confirmPassword}
                        ref={confirmPasswordRef}
                        onChange={handleConfirmPassword}
                    />
                    <span className="error-message">{errors.confirmPassword && errors.confirmPassword}</span>
                </div>
                <button>Register</button>
            </form>
            <Link to='/login'>Login</Link>
        </div>
    );
}

export default Register