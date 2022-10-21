import { useEffect, useRef } from 'react'
import axios from '../api/axios'
import useAuth from './useAuth'
import useRefreshToken from './useRefreshToken'

function useAxiosPrivate() {
    const refreshToken = useRefreshToken()
    const { auth = {} } = useAuth()
    const { accessToken = '' } = auth
    let sentOnce = useRef(false)

    useEffect(() => {
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
                const prevRequest = err.config
                if (err.response.status === 403 && !sentOnce.current) {
                    sentOnce.current = true
                    const newAccessToken = await refreshToken()
                    if (newAccessToken !== null) {
                        console.log(1)
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                        return axios(prevRequest)
                    }
                }
                console.log(2)
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