import React, { useState } from 'react'
import { useQuery } from "@tanstack/react-query"
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

function Friends() {
    const [friendUserName, setFriendUserName] = useState(null)
    const axiosPrivate = useAxiosPrivate()
    const { data, isLoading } = useQuery({
        queryKey: ['friends'],
        queryFn: () => axiosPrivate.get('/friend')
    })
    const { refetch: unFriendRequest } = useQuery({
        queryKey: ['unfriend', friendUserName],
        queryFn: () => axiosPrivate.post('friend/unfriend', { userName: friendUserName }),
        onSuccess: () => alert('unfriended'),
        onError: () => alert('error'),
        enabled: false,
        retry: 0
    })
    const unFriend = userName => {
        setFriendUserName(userName)
        unFriendRequest()
    }

    return (
        <div>
            {
                !isLoading && (
                    data?.data?.friends?.map(friend => (
                        <div key={friend._id}>
                            <div>{friend.userName}</div>
                            <button onClick={() => unFriend(friend.userName)}>unfriend</button>
                        </div>
                    ))
                )
            }
        </div>
    )
}

export default Friends