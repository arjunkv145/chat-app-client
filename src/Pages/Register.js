import "./sassStyles/register.scss"
import axios from "../api/axios"
import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

function Register() {
    // const { setAuth } = useAuth()
    // const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({
        userName: null,
        email: null,
        password: null,
        confirmPassword: null
    })
    const [credentialsAvailable, setCredentialsAvailable] = useState({
        userName: null,
        email: null
    })
    const [credentialsAvailableLoadingState, setCredentialsAvailableLoadingState] = useState({
        userName: false,
        email: false
    })
    const isSubmittedOnce = useRef(false)

    const handleErrors = useCallback(() => {
        let userNameErrorMessage = null
        let emailErrorMessage = null
        let passwordErrorMessage = null
        let confirmPasswordErrorMessage = null

        if (userName.trim() === '') {
            userNameErrorMessage = 'UserName is required'
        }

        if (email.trim() === '') {
            emailErrorMessage = 'Email is required'
        } else if (email.match(regexEmail) === null) {
            emailErrorMessage = 'Email is not valid'
        }

        if (password.trim() === '') {
            passwordErrorMessage = 'Password is required'
        } else if (password.trim().length < 8) {
            passwordErrorMessage = 'Password must be atleast 8 characters'
        }

        if (confirmPassword.trim() !== password.trim()) {
            confirmPasswordErrorMessage = 'Passwords does not match'
        }

        setErrors(prev => ({
            ...prev,
            userName: userNameErrorMessage,
            email: emailErrorMessage,
            password: passwordErrorMessage,
            confirmPassword: confirmPasswordErrorMessage
        }))

        return (
            userNameErrorMessage === null &&
            emailErrorMessage === null &&
            passwordErrorMessage === null &&
            confirmPasswordErrorMessage === null
        ) ? true : false
    }, [userName, email, password, confirmPassword])

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true
        const fetchData = async () => {
            isMounted && setCredentialsAvailable(prev => ({ ...prev, userName: null }))
            isMounted && setCredentialsAvailableLoadingState(prev => ({ ...prev, userName: false }))
            if (userName.trim() !== '') {
                let userNameAvailableMessage = null
                try {
                    isMounted && setCredentialsAvailableLoadingState(prev => ({ ...prev, userName: true }))
                    const res = await axios.get(`check_username/${userName.trim()}`, { signal: controller.signal })
                    if (res.data.message === "Username is available") {
                        userNameAvailableMessage = res.data.message
                    } else if (res.data.message === "Username is not available") {
                        userNameAvailableMessage = res.data.message
                    }
                    console.log(res.data)
                } catch (err) {
                    userNameAvailableMessage = "server not responding"
                } finally {
                    isMounted && setCredentialsAvailable(prev => ({ ...prev, userName: userNameAvailableMessage }))
                    isMounted && setCredentialsAvailableLoadingState(prev => ({ ...prev, userName: false }))
                }
            }
        }
        fetchData()

        return () => {
            controller.abort()
            isMounted = false
        }
    }, [userName])

    useEffect(() => {
        const fetchData = async () => {
            setCredentialsAvailable(prev => ({ ...prev, email: null }))
            if (email.trim() !== '' && email.match(regexEmail) !== null) {
                let emailAvailableMessage = null
                try {
                    setCredentialsAvailableLoadingState(prev => ({ ...prev, email: true }))
                    const res = await axios.get(`check_email/${email.trim()}`)
                    if (res.data.message === "Email is available") {
                        emailAvailableMessage = res.data.message
                    } else if (res.data.message === "Email is not available") {
                        emailAvailableMessage = res.data.message
                    }
                    console.log(res.data)
                } catch (err) {
                    emailAvailableMessage = "server not responding"
                } finally {
                    setCredentialsAvailable(prev => ({ ...prev, email: emailAvailableMessage }))
                    setCredentialsAvailableLoadingState(prev => ({ ...prev, email: false }))
                }
            }
        }
        fetchData()
    }, [email])


    // userName: yup.string().required("User name is required")
    //     .test('Username availabily check', 'Username is not available', value => {
    //         setUserNameAvailable(null)
    //         return new Promise((resolve, reject) => {
    //             if (value.trim() === '') resolve(true)
    //             else if (userNameFocusState === true) {
    //                 setUserNameAvailable("loading")
    //                 axios.get(`check_username/${value.trim()}`)
    //                     .then(res => {
    //                         if (res.data.message === "Username is available") {
    //                             console.log("available")
    //                             setUserNameAvailable("available")
    //                             resolve(true)
    //                         } else if (res.data.message === "Username is not available") {
    //                             console.log("not available")
    //                             setUserNameAvailable(null)
    //                             resolve(false)
    //                         } else {
    //                             console.log(res.data.message)
    //                             setUserNameAvailable(null)
    //                             resolve(false)
    //                         }
    //                     })
    //                     .catch((err) => {
    //                         setUserNameAvailable(null)
    //                         resolve(false)
    //                     })
    //             } else resolve(true)
    //         })
    //     })
    //     .test('Check Whitespaces', 'not a valid username', value => {
    //         return value.trim() === '' ? false : true
    //     }),
    // email: yup.string().required("Email is required").email("Must be a valid email")
    //     .test('Email availabily check', 'Email is not available', value => {
    //         setEmailAvailable(null)
    //         return new Promise((resolve, reject) => {
    //             if (value.trim() === '') resolve(true)
    //             else if (emailFocusState === true) {
    //                 setEmailAvailable("loading")
    //                 axios.get(`check_email/${value.trim()}`)
    //                     .then(res => {
    //                         if (res.data.message === "Email is available") {
    //                             console.log("available")
    //                             setEmailAvailable("available")
    //                             resolve(true)
    //                         } else if (res.data.message === "Email is not available") {
    //                             console.log("not available")
    //                             setEmailAvailable(null)
    //                             resolve(false)
    //                         } else {
    //                             console.log(res)
    //                             console.log(res.data.message)
    //                             setUserNameAvailable(null)
    //                             resolve(false)
    //                         }
    //                     })
    //                     .catch((err) => {
    //                         setEmailAvailable(null)
    //                         resolve(false)
    //                     })
    //             } else resolve(true)
    //         })
    //     }),

    useEffect(() => {
        if (isSubmittedOnce.current === true) {
            handleErrors()
        }
    }, [userName, email, password, confirmPassword, handleErrors])

    const handleSubmit = e => {
        e.preventDefault()
        isSubmittedOnce.current = true
        const submitStatus = handleErrors()
        if (submitStatus === true) {
            // axios.post('register', { userName, email, password })
            //     .then((res) => {
            //         console.log(res)
            //         setAuth(prev => ({
            //             ...prev,
            //             user: res.data.user,
            //             accessToken: res.data.accessToken,
            //             isLoggedIn: true
            //         }))
            //     })
            //     .catch(err => console.log(err))
            console.log('registering')
        } else {
            console.log('error')
        }
    }
    return (
        <div className="register-page">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userName">User name</label>
                    <input
                        type="text"
                        name="userName"
                        id="userName"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
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
                        onChange={e => setEmail(e.target.value)}
                    />
                    <span className="error-message">{errors.email && errors.email}</span>
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
                    <span className="error-message">{errors.password && errors.password}</span>
                </div>
                <div>
                    <label htmlFor="cpassword">Confirm password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
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