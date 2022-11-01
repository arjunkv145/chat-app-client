import { RouterProvider, createBrowserRouter } from "react-router-dom"
import CheckIsLoggedIn from "./components/CheckIsLoggedIn"
import AuthRoute from "./components/AuthRoute"
import Chat from "./Pages/Chat"
import ErrorPage from "./Pages/ErrorPage"
import Group from "./Pages/Group"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import ForgottenPassword from "./Pages/ForgottenPassword"
import InternetConnection from "./components/InternetConnection"
import PasswordReset from "./Pages/PasswordReset"

import './Pages/sassStyles/form.scss'

const router = createBrowserRouter([
    {
        path: '/',
        element: <InternetConnection />,
        children: [
            {
                element: <CheckIsLoggedIn />,
                children: [
                    { path: '/', element: <Login /> },
                    { path: '/signup', element: <Signup /> },
                    { path: '/forgottenpassword', element: <ForgottenPassword /> },
                    { path: '/passwordreset/:passwordresettoken', element: <PasswordReset /> },
                ]
            },
            {
                element: <AuthRoute />,
                children: [
                    { path: '/chat', element: <Chat /> },
                    { path: '/group', element: <Group /> },
                ]
            }
        ]
    },
    { path: '/*', element: <ErrorPage /> }
])

function App() {
    return <RouterProvider router={router} />
}

export default App