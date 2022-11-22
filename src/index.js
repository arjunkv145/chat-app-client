import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AuthProvider from './AuthProvider'
import SocketProvider from './SocketProvider'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <AuthProvider>
        <SocketProvider>
            <App />
        </SocketProvider>
    </AuthProvider>
);