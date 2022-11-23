import React, { useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import useAuth from '../hooks/useAuth'
import PopupAlert from '../components/PopupAlert'
import PageLoader from '../components/PageLoader'
import { Link } from 'react-router-dom'
import useSocket from '../hooks/useSocket'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'

function VerifyYourEmail() {
    const { auth, setAuth } = useAuth()
    const socket = useSocket()
    const axiosPrivate = useAxiosPrivate()
    const [openPopupAlert, setOpenPopupAlert] = useState(false)
    const [serverResponse, setServerResponse] = useState({
        title: null,
        body: null
    })

    const { mutate: reSendRequest, isFetching: isFetchingReSend } = useMutation(
        email => axiosInstance.post('signup/verify-your-email/resend/', { email }),
        {
            onSuccess: () => setServerResponse({
                title: "New link sent!",
                body: "A new link has been sent to your email. Verify your account by clicking the link."
            }),
            onError: error => {
                if (error?.response?.status === 422) {
                    setServerResponse({
                        title: "Your email is already verified",
                        body: "You can reload the page to use the app."
                    })
                } else {
                    setServerResponse({
                        title: "Server not responding",
                        body: "We couldn't send a new link, please try again later."
                    })
                }
            },
            onSettled: () => setOpenPopupAlert(true)
        }
    )
    const { mutate: logoutRequest, isFetching: isFetchingLogout } = useMutation(
        () => axiosPrivate.post('logout'),
        {
            onSuccess: () => {
                socket.emit('logout', {
                    room: auth.user.userName,
                    sessionId: auth.sessionId
                })
                setAuth({
                    user: {},
                    accessToken: null,
                    isLoggedIn: false,
                    sessionId: null
                })
            },
            onError: () => {
                setServerResponse({
                    title: "Can't log out",
                    body: "The server is not responding at the moment, please try again later."
                })
                setOpenPopupAlert(true)
            }
        }
    )

    return (
        <>
            <main className='verify-your-email'>
                <h1 className='verify-your-email__title'>Verify your email account</h1>
                <p className='verify-your-email__content'>
                    A link has been sent to your account to verify your email.
                    Click resend if you haven't received the link.
                </p>
                <button className='btn' onClick={() => reSendRequest(auth.user.email)}>resend</button>
                <p className='verify-your-email__logout'>
                    Used a wrong email to signup? logout and signup with a new email.&nbsp;
                    <Link to='#' onClick={e => {
                        e.preventDefault()
                        logoutRequest()
                    }}>
                        logout
                    </Link>
                </p>
            </main>
            <PopupAlert
                title={serverResponse.title}
                body={serverResponse.body}
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
            {(isFetchingLogout || isFetchingReSend) && <PageLoader />}
        </>
    )
}

export default VerifyYourEmail