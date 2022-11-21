import React from 'react'
import { useQuery } from "@tanstack/react-query"
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

function Pending() {
    const axiosPrivate = useAxiosPrivate()
    const { data, isLoading } = useQuery({
        queryKey: ['pending-requests'],
        queryFn: () => axiosPrivate.get('/friend/pending')
    })

    return (
        <div>
            {
                !isLoading && (
                    data?.data?.pendingRequest?.map(request => (
                        <div key={request._id}>{request.userName}</div>
                    ))
                )
            }
        </div>
    )
}

export default Pending