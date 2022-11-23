import React from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { AccountCircle, Close } from '@mui/icons-material'

function Friends() {
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    const { data } = useQuery({
        queryKey: ['friends'],
        queryFn: () => axiosPrivate.get('/friend')
    })
    const { mutate: unFriendRequest } = useMutation(
        userName => axiosPrivate.post('friend/unfriend', { userName }),
        {
            onSuccess: () => queryClient.invalidateQueries('friends')
        }
    )

    return (
        <div className='add-friend-list'>
            {
                data?.data?.friends?.map(friend => (
                    <div key={friend._id} className='add-friend-list__list-item'>
                        <div className='add-friend-list__image'><AccountCircle /></div>
                        <div className='add-friend-list__name'>{friend.userName}</div>
                        <button
                            className='add-friend-list__btn'
                            onClick={() => unFriendRequest(friend.userName)}
                        >
                            <Close />
                        </button>
                    </div>
                ))
            }
        </div>
    )
}

export default Friends