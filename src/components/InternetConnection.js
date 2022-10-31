import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

function InternetConnection() {
    const [internetConnection, setInternetConnection] = useState(navigator.onLine)

    const setOnline = () => setInternetConnection(true)
    const setOffline = () => setInternetConnection(false)
    const style = {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '400',
        fontSize: '.8rem',
        letterSpacing: '1px',
        background: '#f54b67',
        color: '#f5f5f5',
        textAlign: 'center',
        padding: '.3em',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%'
    }

    useEffect(() => {
        window.addEventListener('online', setOnline)
        window.addEventListener('offline', setOffline)

        return () => {
            window.removeEventListener('online', setOnline)
            window.removeEventListener('offline', setOffline)
        }
    }, [])
    return (
        <>
            {
                !internetConnection &&
                <div style={style}>
                    you are offline
                </div>
            }
            <Outlet />
        </>
    )
}

export default InternetConnection