import { useEffect } from 'react'
import axiosInstance from '../api/axios'
import useAuth from './useAuth'
import useRefreshToken from './useRefreshToken'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

function useAxiosPrivate() {
    const refreshToken = useRefreshToken()
    const { auth, setAuth } = useAuth()

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            async config => {
                const { exp } = jwt_decode(auth.accessToken)
                const isExpired = Date.now() >= exp * 1000
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                if (isExpired) {
                    console.log('got new token')
                    const res = await axios.get('http://localhost:3030/api/', { withCredentials: true })
                    setAuth(prev => ({
                        ...prev,
                        accessToken: res.data.accessToken
                    }))
                    config.headers['Authorization'] = `Bearer ${res.data.accessToken}`
                }
                return config

            }, err => Promise.reject(err)
        )
        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor)
        }
    }, [auth.accessToken, setAuth, refreshToken])
    return axiosInstance
}

export default useAxiosPrivate