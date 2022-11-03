import { RouterProvider, createBrowserRouter } from "react-router-dom"
import CheckIsNotLoggedIn from "./components/CheckIsNotLoggedIn"
import AuthRoute from "./components/AuthRoute"
import Chat from "./Pages/Chat"
import ErrorPage from "./Pages/ErrorPage"
import Group from "./Pages/Group"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import ForgottenPassword from "./Pages/ForgottenPassword"
import PasswordReset, { loader as passwordResetLoader } from "./Pages/PasswordReset"
import AddFriend from "./Pages/AddFriend"
import Settings from "./Pages/Settings"
import PublicGroup from "./Pages/PublicGroup"
import Root, { loader as rootLoader } from './components/Root'

import './Pages/sassStyles/form.scss'
import ChatMessage from "./components/ChatMessage"

const router = createBrowserRouter([
    {
        path: '/',
        loader: rootLoader,
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <CheckIsNotLoggedIn />,
                children: [
                    { path: '/', element: <Login /> },
                    { path: '/signup', element: <Signup /> },
                    { path: '/forgottenpassword', element: <ForgottenPassword /> },
                    {
                        path: '/passwordreset/:passwordresettoken',
                        loader: passwordResetLoader,
                        element: <PasswordReset />
                    },
                ]
            },
            {
                element: <AuthRoute />,
                children: [
                    {
                        path: '/chat',
                        element: <Chat />,
                        children: [
                            { path: ':chatId', element: <ChatMessage /> }
                        ]
                    },
                    { path: '/group', element: <Group /> },
                    { path: '/publicgroup', element: <PublicGroup /> },
                    { path: '/addfriend', element: <AddFriend /> },
                    { path: '/settings', element: <Settings /> },
                ]
            }
        ]
    }
])

function App() {
    return <RouterProvider router={router} />
}

export default App