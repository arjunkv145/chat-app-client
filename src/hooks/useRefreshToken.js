import axios from '../api/axios'
import useAuth from './useAuth'

function useRefreshToken() {
    const { setAuth } = useAuth()

    const refreshToken = async () => {
        try {
            const res = await axios.post('refreshtoken')
            console.log(res)
            setAuth(prev => ({
                ...prev,
                user: res.data.user,
                isLoggedIn: true,
                accessToken: res.data.accessToken
            }))
            return res.data.accessToken
        } catch (err) {
            console.log(err.response.data)
            return null
        }
    }
    return refreshToken
}

export default useRefreshToken