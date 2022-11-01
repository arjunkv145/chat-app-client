import axiosInstance from "../api/axios"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Button from "../components/Button"
import PopupAlert from "../components/PopupAlert"

const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

function Signup() {
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
    const [openPopupAlert, setOpenPopupAlert] = useState(false)

    const handleUserName = () => {
        let userNameErrorMessage = null
        const { value } = userNameRef.current
        if (value.trim() === '') {
            userNameErrorMessage = 'Username is required'
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
            emailErrorMessage = 'This email is not valid'
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

        const fetchData = async () => {
            let userNameErrorMessage = null
            isMounted && setErrors(prev => ({ ...prev, userName: null }))
            try {
                const res = await axiosInstance.get(`signup/isusernameavailable/${userName.trim()}`, { signal: controller.signal })
                if (res.data.message === "Username is available") {
                    userNameErrorMessage = res.data.message
                } else if (res.data.message === "This username is already taken") {
                    userNameErrorMessage = res.data.message
                }
            } catch (err) {
                userNameErrorMessage = "server not responding"
            } finally {
                isMounted && setErrors(prev => ({ ...prev, userName: userNameErrorMessage }))
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

        const fetchData = async () => {
            let emailErrorMessage = null
            isMounted && setErrors(prev => ({ ...prev, email: null }))
            try {
                const res = await axiosInstance.get(`signup/isemailavailable/${email.trim()}`)
                if (res.data.message === "Email is available") {
                    emailErrorMessage = res.data.message
                } else if (res.data.message === "This email is already taken") {
                    emailErrorMessage = res.data.message
                }
            } catch (err) {
                emailErrorMessage = "server not responding"
            } finally {
                isMounted && setErrors(prev => ({ ...prev, email: emailErrorMessage }))
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

    const handleSubmit = async e => {
        e.preventDefault()
        const submitStatus = (
            handleUserName() &&
            handleEmail() &&
            handlePassword() &&
            handleConfirmPassword() &&
            errors.userName === 'Username is available' &&
            errors.email === 'Email is available'
        ) ? true : false
        if (submitStatus === true) {
            try {
                const res = await axiosInstance.post('signup/newuser', { userName, email, password })
                setAuth(prev => ({
                    ...prev,
                    user: res.data.user,
                    accessToken: res.data.accessToken,
                    isLoggedIn: true
                }))
            } catch (err) {
                setOpenPopupAlert(true)
            }
        }
    }
    return (
        <main className="form-container">
            <h1 className="title">Chat App</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        autoComplete="off"
                        value={userName}
                        ref={userNameRef}
                        onChange={handleUserName}
                    />
                    {
                        (errors.userName && errors.userName !== 'Username is available') &&
                        <span className="input-error-message">
                            {errors.userName}
                        </span>
                    }
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter your email"
                        autoComplete="off"
                        value={email}
                        ref={emailRef}
                        onChange={handleEmail}
                    />
                    {
                        (errors.email && errors.email !== 'Email is available') &&
                        <span className="input-error-message">
                            {errors.email}
                        </span>
                    }
                </div>
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
                    <Button>signup</Button>
                </div>
            </form>
            <div className="link-container">
                <p className="login-link">
                    Already have an account?&nbsp;
                    <Link to='/'>
                        login
                    </Link>
                </p>
            </div>
            <PopupAlert
                title="Server not responding"
                body="The server is not responding at the moment, please try again later."
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
        </main>
    );
}

export default Signup