// import axiosInstance from "../api/axiosInstance"
// import { useState, useEffect, useRef } from "react"
// import { Link } from "react-router-dom"
// import useAuth from "../hooks/useAuth"
// import PopupAlert from "../components/PopupAlert"
// import PageLoader from "../components/PageLoader"

// const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

// function Signup() {
//     const { setAuth } = useAuth()

//     const [userName, setUserName] = useState('')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [confirmPassword, setConfirmPassword] = useState('')

//     const userNameRef = useRef()
//     const emailRef = useRef()
//     const passwordRef = useRef()
//     const confirmPasswordRef = useRef()

//     const [errors, setErrors] = useState({
//         userName: null,
//         email: null,
//         password: null,
//         confirmPassword: null
//     })
//     const [credentialsAvailable, setCredentialsAvailable] = useState({
//         userName: false,
//         email: false
//     })
//     const [openPopupAlert, setOpenPopupAlert] = useState(false)
//     const [isLoading, setIsLoading] = useState(false)

//     const handleUserName = () => {
//         setCredentialsAvailable(prev => ({
//             ...prev,
//             userName: false
//         }))

//         const { value } = userNameRef.current
//         setUserName(value)

//         if (value.trim() === '') {
//             setErrors(prev => ({ ...prev, userName: 'Username is required' }))
//             return false
//         }
//         return true
//     }

//     const handleEmail = () => {
//         setCredentialsAvailable(prev => ({
//             ...prev,
//             false: false
//         }))

//         const { value } = emailRef.current
//         setEmail(value)

//         if (value.trim() === '') {
//             setErrors(prev => ({ ...prev, email: 'Email is required' }))
//             return false
//         } else if (value.match(regexEmail) === null) {
//             setErrors(prev => ({ ...prev, email: 'This email is not valid' }))
//             return false
//         }

//         return true
//     }

//     const handlePassword = () => {
//         let passwordErrorMessage = null
//         const { value } = passwordRef.current
//         if (value.trim() === '') {
//             passwordErrorMessage = 'Password is required'
//         } else if (value.trim().length < 8) {
//             passwordErrorMessage = 'Password must be atleast 8 characters'
//         }
//         setPassword(value)
//         setErrors(prev => ({ ...prev, password: passwordErrorMessage }))
//         handleConfirmPassword()
//         return passwordErrorMessage === null ? true : false
//     }

//     const handleConfirmPassword = () => {
//         let confirmPasswordErrorMessage = null
//         const { value } = confirmPasswordRef.current
//         if (value.trim() !== passwordRef.current.value.trim()) {
//             confirmPasswordErrorMessage = 'Both passwords must match'
//         }
//         setConfirmPassword(value)
//         setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordErrorMessage }))
//         return confirmPasswordErrorMessage === null ? true : false
//     }

//     useEffect(() => {
//         const controller = new AbortController()
//         let isMounted = true

//         const fetchData = async () => {
//             let userNameErrorMessage = null
//             isMounted && setErrors(prev => ({ ...prev, userName: null }))
//             try {
//                 const res = await axiosInstance.get(`signup/is-username-available/${userName.trim()}`, { signal: controller.signal })
//                 console.log(res)
//                 if (res.data.message === "Username is available") {
//                     isMounted && setCredentialsAvailable(prev => ({
//                         ...prev,
//                         userName: true
//                     }))
//                 } else if (res.data.message === "This username is already taken") {
//                     userNameErrorMessage = res.data.message
//                 }
//             } catch (err) {
//                 userNameErrorMessage = "server not responding"
//             } finally {
//                 isMounted && setErrors(prev => ({ ...prev, userName: userNameErrorMessage }))
//             }
//         }

//         if (userName.trim() !== '') {
//             fetchData()
//         }

//         return () => {
//             controller.abort()
//             isMounted = false
//         }
//     }, [userName])

//     useEffect(() => {
//         const controller = new AbortController()
//         let isMounted = true

//         const fetchData = async () => {
//             let emailErrorMessage = null
//             isMounted && setErrors(prev => ({ ...prev, email: null }))
//             try {
//                 const res = await axiosInstance.get(`signup/is-email-available/${email.trim()}`, { signal: controller.signal })
//                 if (res.data.message === "Email is available") {
//                     isMounted && setCredentialsAvailable(prev => ({
//                         ...prev,
//                         email: true
//                     }))
//                 } else if (res.data.message === "This email is already taken") {
//                     emailErrorMessage = res.data.message
//                 }
//             } catch (err) {
//                 emailErrorMessage = "server not responding"
//             } finally {
//                 isMounted && setErrors(prev => ({ ...prev, email: emailErrorMessage }))
//             }
//         }
//         if (email.trim() !== '' && email.match(regexEmail) !== null) {
//             fetchData()
//         }

//         return () => {
//             controller.abort()
//             isMounted = false
//         }
//     }, [email])

//     useEffect(() => {
//         userNameRef.current.focus()
//     }, [])

//     const handleSubmit = async e => {
//         e.preventDefault()
//         const submitStatus = (
//             handleUserName() &&
//             handleEmail() &&
//             handlePassword() &&
//             handleConfirmPassword() &&
//             credentialsAvailable.userName === true &&
//             credentialsAvailable.email === true
//         ) ? true : false
//         if (submitStatus === true) {
//             try {
//                 setIsLoading(true)
//                 const res = await axiosInstance.post('signup/new-user', { userName, email, password })
//                 setAuth({
//                     user: res.data.user,
//                     accessToken: res.data.accessToken,
//                     isLoggedIn: true,
//                     sessionId: res.data.sessionId
//                 })
//             } catch (err) {
//                 setOpenPopupAlert(true)
//             } finally {
//                 setIsLoading(false)
//             }
//         } else {
//             if (
//                 errors.userName === 'server not responding' ||
//                 errors.email === 'server not responding'
//             ) {
//                 setOpenPopupAlert(true)
//             }
//         }
//     }
//     return (
//         <>
//             <main className="form">
//                 <h1 className="form__title">Chat App</h1>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form__input-wrapper">
//                         <input
//                             type="text"
//                             placeholder="Enter your username"
//                             autoComplete="off"
//                             value={userName}
//                             ref={userNameRef}
//                             onChange={handleUserName}
//                             className="form__input"
//                         />
//                         {
//                             (errors.userName && errors.userName !== 'Username is available') &&
//                             <span
//                                 className="form__error-message"
//                             >
//                                 {errors.userName}
//                             </span>
//                         }
//                     </div>
//                     <div className="form__input-wrapper">
//                         <input
//                             type="text"
//                             placeholder="Enter your email"
//                             autoComplete="off"
//                             value={email}
//                             ref={emailRef}
//                             onChange={handleEmail}
//                             className="form__input"
//                         />
//                         {
//                             (errors.email && errors.email !== 'Email is available') &&
//                             <span
//                                 className="form__error-message"
//                             >
//                                 {errors.email}
//                             </span>
//                         }
//                     </div>
//                     <div className="form__input-wrapper">
//                         <input
//                             type="password"
//                             placeholder="Enter your password"
//                             value={password}
//                             ref={passwordRef}
//                             onChange={handlePassword}
//                             className="form__input"
//                         />
//                         {
//                             errors.password &&
//                             <span
//                                 className="form__error-message"
//                             >
//                                 {errors.password}
//                             </span>
//                         }
//                     </div>
//                     <div className="form__input-wrapper">
//                         <input
//                             type="password"
//                             placeholder="Re-enter your password"
//                             value={confirmPassword}
//                             ref={confirmPasswordRef}
//                             onChange={handleConfirmPassword}
//                             className="form__input"
//                         />
//                         {
//                             errors.confirmPassword &&
//                             <span
//                                 className="form__error-message"
//                             >
//                                 {errors.confirmPassword}
//                             </span>
//                         }
//                     </div>
//                     <div className="form__btn-wrapper">
//                         <button className="btn">signup</button>
//                     </div>
//                 </form>
//                 <div className="form__link-wrapper">
//                     <span className="form__link-login">
//                         Already have an account?&nbsp;
//                         <Link to='/'>
//                             login
//                         </Link>
//                     </span>
//                 </div>
//             </main>
//             <PopupAlert
//                 title="Server not responding"
//                 body="The server is not responding at the moment, please try again later."
//                 openPopupAlert={openPopupAlert}
//                 setOpenPopupAlert={setOpenPopupAlert}
//             />
//             {isLoading && <PageLoader />}
//         </>
//     )
// }

// export default Signup

import axiosInstance from "../api/axiosInstance"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import PopupAlert from "../components/PopupAlert"
import PageLoader from "../components/PageLoader"

const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

function Signup() {
    const [formValues, setFormValues] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const { setAuth } = useAuth()
    const [errors, setErrors] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [touched, setTouched] = useState({
        userName: false,
        email: false,
        password: false,
        confirmPassword: false
    })
    const userNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()

    const [credentialsAvailable, setCredentialsAvailable] = useState({
        userName: false,
        email: false
    })
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = e => {
        setFormValues(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        checkErrors()
    }
    const handleTouch = e => {
        if (touched[e.target.name] === false) {
            setTouched(prev => ({
                ...prev,
                [e.target.name]: true
            }))
            checkErrors()
        }
    }
    const checkErrors = () => {
        const userName = userNameRef.current.value
        const email = emailRef.current.value
        const password = passwordRef.current.value
        const confirmPassword = confirmPasswordRef.current.value

        const errors = {
            userName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
        if (userName.trim() === '') {
            errors.userName = 'Username is required'
        } else if (credentialsAvailable.userName === false) {
            errors.userName = 'This username is already taken'
        }
        if (email.trim() === '') {
            errors.email = 'Email is required'
        } else if (email.match(regexEmail) === null) {
            errors.email = 'Email is invalid'
        } else if (credentialsAvailable.email === false) {
            errors.email = 'This email is already taken'
        }
        if (password.trim() === '') {
            errors.password = 'Password is required'
        }
        if (confirmPassword.trim() === '') {
            errors.confirmPassword = 'You must retype your password'
        } else if (password.trim() !== confirmPassword.trim()) {
            errors.confirmPassword = 'Both passwords must match'
        }
        setErrors(errors)
        return (
            errors.userName === '' &&
            errors.email === '' &&
            errors.password === '' &&
            errors.confirmPassword === ''
        ) ? true : false
    }

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const fetchData = async () => {
            let userNameErrorMessage = null
            isMounted && setErrors(prev => ({ ...prev, userName: null }))
            try {
                const res = await axiosInstance.get(`signup/is-username-available/${formValues.userName.trim()}`, { signal: controller.signal })
                console.log('username')
                console.log(res)
                if (res.data.message === "Username is available") {
                    isMounted && setCredentialsAvailable(prev => ({
                        ...prev,
                        userName: true
                    }))
                } else if (res.data.message === "This username is already taken") {
                    isMounted && setCredentialsAvailable(prev => ({
                        ...prev,
                        userName: false
                    }))
                    userNameErrorMessage = res.data.message
                }
            } catch (err) {
                userNameErrorMessage = "server not responding"
            } finally {
                isMounted && setErrors(prev => ({ ...prev, userName: userNameErrorMessage }))
            }
        }

        if (formValues.userName.trim() !== '') {
            fetchData()
        }

        return () => {
            controller.abort()
            isMounted = false
        }
    }, [formValues.userName])

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const fetchData = async () => {
            let emailErrorMessage = null
            isMounted && setErrors(prev => ({ ...prev, email: '' }))
            try {
                const res = await axiosInstance.get(`signup/is-email-available/${formValues.email.trim()}`, { signal: controller.signal })
                console.log('email')
                if (res.data.message === "Email is available") {
                    isMounted && setCredentialsAvailable(prev => ({
                        ...prev,
                        email: true
                    }))
                } else if (res.data.message === "This email is already taken") {
                    isMounted && setCredentialsAvailable(prev => ({
                        ...prev,
                        email: false
                    }))
                    emailErrorMessage = res.data.message
                }
            } catch (err) {
                emailErrorMessage = "server not responding"
            } finally {
                isMounted && setErrors(prev => ({ ...prev, email: emailErrorMessage }))
            }
        }
        if (formValues.email.trim() !== '' && formValues.email.match(regexEmail) !== null) {
            fetchData()
        }

        return () => {
            controller.abort()
            isMounted = false
        }
    }, [formValues.email])

    useEffect(() => {
        userNameRef.current.focus()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()
        setTouched(prev => ({
            userName: true,
            email: true,
            password: true,
            confirmPassword: true
        }))
        const submitStatus = (
            checkErrors() &&
            credentialsAvailable.userName === true &&
            credentialsAvailable.email === true
        ) ? true : false
        if (submitStatus === true) {
            try {
                return console.log('submit')
                // setIsLoading(true)
                // const res = await axiosInstance.post('signup/new-user', formValues)
                // setAuth({
                //     user: res.data.user,
                //     accessToken: res.data.accessToken,
                //     isLoggedIn: true,
                //     sessionId: res.data.sessionId
                // })
            } catch (err) {
                setOpenPopupAlert(true)
            } finally {
                setIsLoading(false)
            }
        } else {
            if (
                errors.userName === 'server not responding' ||
                errors.email === 'server not responding'
            ) {
                setOpenPopupAlert(true)
            }
        }
    }
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
                            onBlur={handleTouch}
                            className="form__input"
                        />
                        {
                            (touched.userName && errors.userName) &&
                            <span
                                className="form__error-message"
                            >
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
                            onBlur={handleTouch}
                            className="form__input"
                        />
                        {
                            (touched.email && errors.email) &&
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
                            name="password"
                            placeholder="Enter your password"
                            value={formValues.password}
                            ref={passwordRef}
                            onChange={handleChange}
                            onBlur={handleTouch}
                            className="form__input"
                        />
                        {
                            (touched.password && errors.password) &&
                            <span
                                className="form__error-message"
                            >
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
                            ref={confirmPasswordRef}
                            onChange={handleChange}
                            onBlur={handleTouch}
                            className="form__input"
                        />
                        {
                            (touched.confirmPassword && errors.confirmPassword) &&
                            <span
                                className="form__error-message"
                            >
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
            {isLoading && <PageLoader />}
        </>
    )
}

export default Signup