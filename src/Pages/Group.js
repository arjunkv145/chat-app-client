import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

function Group() {
    const axiosPrivate = useAxiosPrivate()
    const [groups, setGroups] = useState(null)
    console.log('groups are ', groups)

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const getGroups = async () => {
            try {
                const res = await axiosPrivate.get('groups')
                isMounted && setGroups(res.data.groups)
            } catch (err) {
                console.log("error is", err)
            }
        }

        getGroups()
        return () => {
            controller.abort()
            isMounted = false
        }
    }, [axiosPrivate])

    return (
        <div>
            Group
            <Link to='/chat'>go to chat page</Link>
        </div>
    )
}

export default Group