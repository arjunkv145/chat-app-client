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
import Root from './components/Root'
import ChatMessage from "./components/chat/Message"
import EmailVerificationLink, { loader as emailVerificationLinkLoader } from "./Pages/EmailVerificationLink"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            retryOnMount: false
        }
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    )
}

export default App