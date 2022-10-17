import "./sassStyles/register.scss";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { setJWT, UserContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

function Register() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user.isLoggedIn === true) {
            navigate('/');
        }
    }, [navigate, user.isLoggedIn])

    const schema = yup.object().shape({
        firstName: yup.string().required("First name is required")
            .test('Check Whitespaces', 'First name is required', value => {
                return value.trim() === '' ? false : true
            }),
        lastName: yup.string().required("Last name is required")
            .test('Check Whitespaces', 'Last name is required', value => {
                return value.trim() === '' ? false : true
            }),
        userName: yup.string().required("User name is required")
            .test('Username availabily check', 'Username is not available', value => {
                setUserNameAvailable(null)
                return new Promise((resolve, reject) => {
                    if (value.trim() === '') resolve(true)
                    else if (userNameFocusState === true) {
                        setUserNameAvailable("loading")
                        axios.get(`http://localhost:3010/check_username/${value.trim()}`)
                            .then(res => {
                                if (res.data.status === "Username is available") {
                                    console.log("available")
                                    setUserNameAvailable("available")
                                    resolve(true)
                                } else if (res.data.status === "Username is not available") {
                                    console.log("not available")
                                    setUserNameAvailable(null)
                                    resolve(false)
                                } else {
                                    console.log(res.data.status)
                                    setUserNameAvailable(null)
                                    resolve(false)
                                }
                            })
                            .catch((err) => {
                                setUserNameAvailable(null)
                                resolve(false)
                            })
                    } else resolve(true)
                })
            })
            .test('Check Whitespaces', 'not a valid username', value => {
                return value.trim() === '' ? false : true
            }),
        email: yup.string().required("Email is required").email("Must be a valid email")
            .test('Email availabily check', 'Email is not available', value => {
                setEmailAvailable(null)
                return new Promise((resolve, reject) => {
                    if (value.trim() === '') resolve(true)
                    else if (emailFocusState === true) {
                        setEmailAvailable("loading")
                        axios.get(`http://localhost:3010/check_email/${value.trim()}`)
                            .then(res => {
                                if (res.data.status === "Email is available") {
                                    console.log("available")
                                    setEmailAvailable("available")
                                    resolve(true)
                                } else if (res.data.status === "Email is not available") {
                                    console.log("not available")
                                    setEmailAvailable(null)
                                    resolve(false)
                                } else {
                                    console.log(res.data.status)
                                    setUserNameAvailable(null)
                                    resolve(false)
                                }
                            })
                            .catch((err) => {
                                setEmailAvailable(null)
                                resolve(false)
                            })
                    } else resolve(true)
                })
            }),
        password: yup.string().required("Message is required")
            .test('Check password length', 'Password must be atleast 8 characters', value => {
                return value.trim().length < 8 ? false : true
            }),
        cpassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
    });


    const [userNameFocusState, setUserNameFocusState] = useState(false)
    const [emailFocusState, setEmailFocusState] = useState(false)
    const [userNameAvailable, setUserNameAvailable] = useState(null)
    const [emailAvailable, setEmailAvailable] = useState(null)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmitHandler = data => {
        Object.keys(data).forEach(k => data[k] = data[k].trim());
        const {
            firstName,
            lastName,
            userName,
            email,
            password
        } = data
        axios.post('register', {
            firstName,
            lastName,
            userName,
            email,
            password
        })
            .then((res) => {
                if (res.data.success === true) {
                    setJWT(res.data.token.split(' ')[1]);
                    setUser(prev => ({
                        ...prev,
                        user: res.data.user,
                        isLoggedIn: true
                    }));
                }
                else {
                    console.log(res);
                }
            })
            .catch(err => console.log(err));
    }
    return (
        <div className="register-page">
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div>
                    <label htmlFor="firstName">First name</label>
                    <input type="text" name="firstName" id="firstName" {...register("firstName")} />
                    <span className="error-message">{errors.firstName?.message}</span>
                </div>
                <div>
                    <label htmlFor="lastName">Last name</label>
                    <input type="text" name="lastName" id="lastName" {...register("lastName")} />
                    <span className="error-message">{errors.lastName?.message}</span>
                </div>
                <div>
                    <label htmlFor="userName">User name</label>
                    <input type="text" name="userName" id="userName" {...register("userName")}
                        onFocus={() => setUserNameFocusState(true)}
                        onBlur={() => setUserNameFocusState(false)}
                    />
                    <span className="error-message">
                        {userNameAvailable !== "loading" && errors.userName?.message}
                        {
                            userNameAvailable === 'loading' ?
                                <div className="loader"></div> : userNameAvailable
                        }
                    </span>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" {...register("email")}
                        onFocus={() => setEmailFocusState(true)}
                        onBlur={() => setEmailFocusState(false)}
                    />
                    <span className="error-message">
                        {emailAvailable !== "loading" && errors.email?.message}
                        {
                            emailAvailable === 'loading' ?
                                <div className="loader"></div> :
                                ((emailAvailable === "available" && !errors.email) && emailAvailable)
                        }
                    </span>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" {...register("password")} />
                    <span className="error-message">{errors.password?.message}</span>
                </div>
                <div>
                    <label htmlFor="cpassword">Confirm password</label>
                    <input type="password" name="cpassword" id="cpassword" {...register("cpassword")} />
                    <span className="error-message">{errors.cpassword?.message}</span>
                </div>
                <button>Register</button>
            </form>
            <button onClick={() => navigate('/login')}>login</button>
        </div>
    );
}

export default Register;