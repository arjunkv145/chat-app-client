import "./login.scss";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

function Login() {
    const schema = yup.object().shape({
        email: yup.string().required("Email is required").email("Must be a valid email"),
        password: yup.string().required("Message is required")
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmitHandler = data => {
        const userData = { ...data }
        Object.keys(userData).forEach(k => userData[k] = userData[k].trim());
        axios.post('http://127.0.0.1:3010/login', {
            ...userData
        })
            .then((res) => {
                console.log(res.data)
            });
    }
    return (
        <div className="login-page">
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" {...register("email")} />
                    <span className="error-message">{errors.email?.message}</span>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" {...register("password")} />
                    <span className="error-message">{errors.password?.message}</span>
                </div>
                <button>Login</button>
            </form>
        </div>
    );
}

export default Login;