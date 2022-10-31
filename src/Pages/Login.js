import "./sassStyles/form.scss"
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
    const isSubmittedOnce = useRef(false)
    const [openPopupAlert, setOpenPopupAlert] = useState(false)

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
                    if (res.data.message === "User doesn't exist") {
                        setErrors(prev => ({
                            ...prev,
                            email: "The email you provided doesn't match any accounts"
                        }))
                    } else if (res.data.message === "Wrong password") {
                        setErrors(prev => ({
                            ...prev,
                            password: "The password you entered is incorrect"
                        }))
                    }
                }
            } catch (err) {
                setOpenPopupAlert(true)
            }
        }
    }

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            handleErrors()
        }
    }, [email, password, handleErrors])

    return (
        <main className="form-container">
            <h1 className="title">Chat App</h1>
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
                <div className="btn-submit">
                    <Button>login</Button>
                </div>
            </form>
            <div className="link-container">
                <Link to='/forgottenpassword'>forgot your password?</Link>
            </div>
            <div className="btn-signup-link">
                <Link to='/signup'>
                    <Button>create an account</Button>
                </Link>
            </div>
            <div className={`popup-container ${openPopupAlert && 'open'}`} onClick={() => setOpenPopupAlert(false)}>
                <div className={`popup ${openPopupAlert && 'open'}`} onClick={e => e.stopPropagation()}>
                    <div className="popup-title">Server not responding</div>
                    <div className="popup-content">
                        The server is not responding at the moment, you may try again later.
                    </div>
                    <Button onClick={() => setOpenPopupAlert(false)}>close</Button>
                </div>
            </div>
        </main>
    );
}

export default Login