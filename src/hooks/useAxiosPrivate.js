import { useEffect } from 'react'
import axiosInstance from '../api/axiosInstance'
import useAuth from './useAuth'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

function useAxiosPrivate() {
    const { auth, setAuth } = useAuth()

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            async config => {
                const { exp } = jwt_decode(auth.accessToken)
                const isExpired = Date.now() >= ((exp - 10) * 1000)
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                if (isExpired) {
                    try {
                        const res = await axios.get('http://localhost:3030/api/user', { withCredentials: true })
                        setAuth(prev => ({
                            ...prev,
                            accessToken: res.data.accessToken
                        }))
                        config.headers['Authorization'] = `Bearer ${res.data.accessToken}`
                    } catch (err) {
                        setAuth(prev => ({
                            ...prev,
                            user: null,
                            accessToken: null,
                            isLoggedIn: false
                        }))
                        return Promise.reject(err)
                    }
                }
                return config

            }, err => Promise.reject(err)
        )

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor)
        }
    }, [auth.accessToken, setAuth])
    return axiosInstance
}

export default useAxiosPrivate