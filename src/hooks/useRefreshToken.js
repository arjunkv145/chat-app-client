import axiosInstance from '../api/axios'
import useAuth from './useAuth'

function useRefreshToken() {
    const { setAuth } = useAuth()

    const refreshToken = async () => {
        try {
            const res = await axiosInstance.get('/')
            setAuth(prev => ({
                ...prev,
                user: res.data.user,
                isLoggedIn: true,
                accessToken: res.data.accessToken
            }))
            return res.data.accessToken
        } catch (err) {
            return ''
        }
    }
    return refreshToken
}

export default useRefreshToken