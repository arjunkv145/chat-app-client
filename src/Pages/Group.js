import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

function Group() {
    const axiosPrivate = useAxiosPrivate()
    const [groups, setGroups] = useState(null)
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const getGroups = async () => {
            try {
                const res = await axiosPrivate.get('group', { signal: controller.signal })
                isMounted && setGroups(res.data.groups)
            } catch (err) {
                isMounted && setServerError('server not responding')
            } finally {
                isMounted && setLoading(false)
            }
        }

        getGroups()
        return () => {
            controller.abort()
            isMounted = false
        }
    }, [axiosPrivate])

    return (
        <div className='group-container'>
            Group
            <p>{serverError && serverError}</p>
            {
                loading ? 'loading' : <p>{groups && groups.join(', ')}</p>
            }
            <Link to='/chat'>go to chat page</Link>
        </div>
    )
}

export default Group