// import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useSocket from '../hooks/useSocket'

function InternetConnection() {
    // const queryClient = useQueryClient()
    const [internetConnection, setInternetConnection] = useState(navigator.onLine)
    const [backendConnection, setBackendConnection] = useState(true)

    const socket = useSocket()
    const { auth } = useAuth()

    useEffect(() => {
        const setOnline = () => setInternetConnection(true)
        const setOffline = () => setInternetConnection(false)

        window.addEventListener('online', setOnline)
        window.addEventListener('offline', setOffline)

        return () => {
            window.removeEventListener('online', setOnline)
            window.removeEventListener('offline', setOffline)
        }
    }, [])

    useEffect(() => {
        const setBackendUp = () => setBackendConnection(true)
        const setBackendDown = () => setBackendConnection(false)

        socket.on('reconnect', setBackendUp)
        socket.on('connect', setBackendUp)

        socket.on('connect_error', setBackendDown)
        socket.on('connect_failed', setBackendDown)
        socket.on('disconnect', setBackendDown)

        return () => {
            socket.off('reconnect', setBackendUp)
            socket.off('connect', setBackendUp)

            socket.off('connect_error', setBackendDown)
            socket.off('connect_failed', setBackendDown)
            socket.off('disconnect', setBackendDown)
        }
    }, [socket])

    useEffect(() => {
        const logoutAll = () => window.location.reload()
        const logout = sessionId => {
            if (sessionId === auth.sessionId) {
                window.location.reload()
            }
        }
        socket.on('logout', logout)
        socket.on('logoutAll', logoutAll)

        return () => {
            socket.off('logout', logout)
            socket.off('logoutAll', logoutAll)
        }
    }, [socket, auth.sessionId])

    useEffect(() => {
        const reloadPage = () => window.location.reload()
        socket.on('email_verified', reloadPage)

        return () => {
            socket.off('email_verified', reloadPage)
        }
    }, [socket, auth.sessionId])
    // useEffect(() => {
    //     socket.on('friend_request_accepted', () => {
    //         // queryClient.invalidateQueries('friends')
    //         // queryClient.invalidateQueries('pending-requests')
    //         queryClient.invalidateQueries('chats')
    //     })
    //     socket.on('friend_request_rejected', () => {
    //         queryClient.invalidateQueries('pending-requests')
    //     })
    //     socket.on('friend_request_sent', () => {
    //         queryClient.invalidateQueries('chats')
    //     })

    //     return () => {
    //         socket.off('friend_request_accepted', () => {
    //             // queryClient.invalidateQueries('friends')
    //             // queryClient.invalidateQueries('pending-requests')
    //             queryClient.invalidateQueries('chats')
    //         })
    //         socket.off('friend_request_rejected', () => {
    //             queryClient.invalidateQueries('pending-requests')
    //         })
    //         socket.off('friend_request_sent', () => {
    //             queryClient.invalidateQueries('chats')
    //         })
    //     }
    // }, [socket, queryClient])

    return (
        <>
            <div className={`connection connection--internet ${!internetConnection ? 'offline' : ''}`}>
                <h1 className='connection__title'>You are offline</h1>
                <p className='connection__content'>Check your internet connection and try again</p>
            </div>
            <div className={`connection connection--backend ${!backendConnection ? 'backend-down' : ''}`}>
                <h1 className='connection__title'>Server not responding</h1>
                <p className='connection__content'>The server is not responding at the moment, please try again later</p>
            </div>
        </>
    )
}

export default InternetConnection