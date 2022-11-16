import { RouterProvider, createBrowserRouter } from "react-router-dom"
import CheckIsNotLoggedIn from "./components/CheckIsNotLoggedIn"
import AuthRoute from "./components/AuthRoute"
import Chat from "./Pages/Chat"
import ErrorPage from "./Pages/ErrorPage"
import Group from "./Pages/Group"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import ForgotYourPassword from "./Pages/ForgotYourPassword"
import PasswordReset, { loader as passwordResetLoader } from "./Pages/PasswordReset"
import AddFriend from "./Pages/AddFriend"
import AddFriendAdd from "./components/addFriend/Add"
import AddFriendPending from "./components/addFriend/Pending"
import AddFriendFriends from "./components/addFriend/Friends"
import Settings from "./Pages/Settings"
import PublicGroup from "./Pages/PublicGroup"
import Root, { loader as rootLoader } from './components/Root'
import ChatMessage from "./components/chat/ChatMessage"
import EmailVerificationLink, { loader as emailVerificationLinkLoader } from "./Pages/EmailVerificationLink"

import './sass/main.scss'

const router = createBrowserRouter([
    {
        path: '/email-verification-link/:emailVerificationToken',
        loader: emailVerificationLinkLoader,
        element: <EmailVerificationLink />,
        errorElement: <ErrorPage />,
    },
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
                    { path: '/forgot-your-password', element: <ForgotYourPassword /> },
                    {
                        path: '/password-reset/:passwordResetToken',
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
                    { path: '/public-group', element: <PublicGroup /> },
                    {
                        path: '/add-friend',
                        element: <AddFriend />,
                        children: [
                            {
                                path: 'add',
                                element: <AddFriendAdd />
                            },
                            {
                                path: 'pending',
                                element: <AddFriendPending />
                            },
                            {
                                path: 'friends',
                                element: <AddFriendFriends />
                            }
                        ]
                    },
                    { path: '/settings', element: <Settings /> },
                ]
            }
        ]
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App