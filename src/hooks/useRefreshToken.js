import axios from '../api/axios'
import useAuth from './useAuth'

function useRefreshToken() {
    const { setAuth } = useAuth()

    const refreshToken = async () => {
        try {
            const res = await axios.post('refreshtoken')
            setAuth(prev => ({
                ...prev,
                user: res.data.user,
                isLoggedIn: true,
                initialLoadingState: false,
                accessToken: res.data.accessToken
            }))
            return res.data.accessToken
        } catch (err) {
            console.log('cant get refresh token')
        }
    }
    return refreshToken
}

export default useRefreshToken