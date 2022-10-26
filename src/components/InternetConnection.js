import React, { useEffect, useState } from 'react'

function InternetConnection() {
    const [internetConnection, setInternetConnection] = useState(navigator.onLine)

    const setOnline = () => setInternetConnection(true)
    const setOffline = () => setInternetConnection(false)

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
                !internetConnection && "you are offline"
            }
        </>
    )
}

export default InternetConnection