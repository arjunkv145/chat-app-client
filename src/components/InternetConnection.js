import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'

function InternetConnection() {
    const [internetConnection, setInternetConnection] = useState(navigator.onLine)
    const [showICComponent, setShowICComponent] = useState(false)

    const { socket } = useAuth()
    const [backendConnection, setBackendConnection] = useState(true)
    const [showBCComponent, setShowBCComponent] = useState(false)

    useEffect(() => {
        const setOnline = () => {
            setInternetConnection(true)
            setTimeout(() => setShowICComponent(false), 1000)
        }

        const setOffline = () => {
            setInternetConnection(false)
            setTimeout(() => setShowICComponent(true), 150)
        }

        window.addEventListener('online', setOnline)
        window.addEventListener('offline', setOffline)

        return () => {
            window.removeEventListener('online', setOnline)
            window.removeEventListener('offline', setOffline)
        }
    }, [])

    useEffect(() => {
        const setBackendUp = () => {
            setBackendConnection(true)
            setTimeout(() => setShowBCComponent(false), 1000)
        }
        const setBackendDown = () => {
            setBackendConnection(false)
            setTimeout(() => setShowBCComponent(true), 150)
        }

        socket.on('reconnect', () => setBackendUp())
        socket.on('connect', () => setBackendUp())

        socket.on('connect_error', () => setBackendDown())
        socket.on('connect_failed', () => setBackendDown())
        socket.on('disconnect', () => setBackendDown())

        return () => {
            socket.off('reconnect', () => setBackendUp())
            socket.off('connect', () => setBackendUp())

            socket.off('connect_error', () => setBackendDown())
            socket.off('connect_failed', () => setBackendDown())
            socket.off('disconnect', () => setBackendDown())
        }
    }, [socket])

    return (
        <>
            <div
                className={
                    `internet-connection ${internetConnection ? 'online' : ''} ${showICComponent ? 'visible' : ''}`
                }
            >
                {
                    internetConnection ? 'Back online' : 'you are offline'
                }
            </div>
            <div
                className={
                    `backend-server-connection ${backendConnection ? 'online' : ''} ${showBCComponent ? 'visible' : ''}`
                }
            >
                {
                    backendConnection ? 'Server is up' : 'Server not responding'
                }
            </div>
        </>
    )
}

export default InternetConnection