import React from 'react'
import { useQuery } from "@tanstack/react-query"
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

function Friends() {
    const axiosPrivate = useAxiosPrivate()
    const { data, isLoading } = useQuery({
        queryKey: ['friends'],
        queryFn: () => axiosPrivate.get('/friend')
    })

    return (
        <div>
            {
                !isLoading && (
                    data?.data?.friends?.map(friend => (
                        <div key={friend._id}>
                            <div>{friend.userName}</div>
                            <button>unfriend</button>
                        </div>
                    ))
                )
            }
        </div>
    )
}

export default Friends