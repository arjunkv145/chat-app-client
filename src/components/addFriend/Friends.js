import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

function Friends() {
    const [success, setSuccess] = useState(false)
    const [friends, setFriends] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const fetchData = async () => {
            try {
                const { data } = await axiosPrivate.get('/friend', { signal: controller.signal })
                isMounted && setSuccess(true)
                isMounted && setFriends(data.friends)
            } catch (err) {
                isMounted && setSuccess(false)
            } finally {
                isMounted && setIsLoading(false)
            }
        }

        fetchData()

        return () => {
            controller.abort()
            isMounted = false
        }
    }, [axiosPrivate])

    return (
        <div>
            {
                !isLoading && (
                    success === true ? (
                        friends.map(friend => (
                            <div key={friend._id}>{friend.userName}</div>
                        ))
                    ) : <span>Server not responding</span>
                )
            }
        </div>
    )
}

export default Friends