import "./sassStyles/login.scss"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "../api/axios"
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

function Login() {
    const { auth, setAuth } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (auth.initialLoadingState === false && auth.isLoggedIn === true) {
            navigate('/')
        }
    }, [auth.initialLoadingState, auth.isLoggedIn, navigate])

    const schema = yup.object().shape({
        email: yup.string().required("Email is required").email("Must be a valid email"),
        password: yup.string().required("Message is required")
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmitHandler = data => {
        const userData = { ...data }
        Object.keys(userData).forEach(k => userData[k] = userData[k].trim())
        axios.post('login', { ...userData })
            .then((res) => {
                if (res.data.success === true) {
                    setAuth(prev => ({
                        ...prev,
                        user: res.data.user,
                        accessToken: res.data.accessToken,
                        isLoggedIn: true
                    }))
                }
            })
            .catch(err => console.log(err))
    }
    return (
        <div className="login-page">
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" autoComplete="Off" {...register("email")} />
                    <span className="error-message">{errors.email?.message}</span>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" {...register("password")} />
                    <span className="error-message">{errors.password?.message}</span>
                </div>
                <button>Login</button>
            </form>
            <button onClick={() => navigate('/register')}>register</button>
        </div>
    );
}

export default Login