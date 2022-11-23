import React from 'react'
import { redirect } from "react-router-dom"
import io from "socket.io-client"
import axiosInstance from '../api/axiosInstance'

export const loader = async ({ request, params }) => {
    try {
        const { data } = await axiosInstance.get('/signup/verify-your-email/' + params.emailVerificationToken, { signal: request.signal })
        const socket = io.connect(process.env.REACT_APP_SOCKET_URL, {
            'reconnection': true,
            'reconnectionDelay': 500,
            'reconnectionAttempts': 10
        })
        socket.emit('email is verified', {
            room: data.userName
        })
        return redirect('/chat')
    } catch (err) {
        throw new Response("Not Found", { status: 404 })
    }
}

function EmailVerificationLink() {
    return (
        <></>
    )
}

export default EmailVerificationLink