import React from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { AccountCircle, Close } from '@mui/icons-material'

function Pending() {
    const axiosPrivate = useAxiosPrivate()
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ['pending-requests'],
        queryFn: () => axiosPrivate.get('/friend/pending'),
        select: data => data.data.pendingRequest
    })
    const { mutate: cancelPendingRequest } = useMutation(
        userName => axiosPrivate.post('friend/cancel-pending-request', { userName }),
        {
            onSuccess: () => queryClient.invalidateQueries('pending-requests')
        }
    )

    return (
        <div className='add-friend-list'>
            {
                !isLoading && (
                    data?.map(request => (
                        <div key={request._id} className='add-friend-list__list-item'>
                            <div className='add-friend-list__image'><AccountCircle /></div>
                            <div className='add-friend-list__name'>{request.userName}</div>
                            <button
                                className='add-friend-list__btn'
                                onClick={() => cancelPendingRequest(request.userName)}
                            >
                                <Close />
                            </button>
                        </div>
                    ))
                )
            }
        </div>
    )
}

export default Pending