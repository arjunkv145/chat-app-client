import { useEffect } from 'react'
import axios from '../api/axios'
import useAuth from './useAuth'
import useRefreshToken from './useRefreshToken'

function useAxiosPrivate() {
    const refreshToken = useRefreshToken()
    const { auth = {} } = useAuth()
    const { accessToken = '' } = auth

    useEffect(() => {
        let sentOnce = false
        const requestInterceptor = axios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`
                }
                return config
            }, err => Promise.reject(err)
        )
        const responseInterceptor = axios.interceptors.response.use(
            res => res,
            async (err) => {
                console.log('ghbhjhfgjhdfghdbghsbeb')
                const prevRequest = err.config
                console.log(err.response.status)
                console.log(prevRequest.sent)
                if (err.response.status === 401 && !sentOnce) {
                    sentOnce = true
                    prevRequest.sent = true
                    const newAccessToken = await refreshToken()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axios(prevRequest)
                }
                return Promise.reject(err)
            }
        )
        return () => {
            axios.interceptors.request.eject(requestInterceptor)
            axios.interceptors.response.eject(responseInterceptor)
        }
    }, [accessToken, refreshToken])
    return axios
}

export default useAxiosPrivate