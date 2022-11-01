import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PopupAlert from '../components/PopupAlert'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

function Group() {
    const axiosPrivate = useAxiosPrivate()
    const [groups, setGroups] = useState(null)
    const [loading, setLoading] = useState(true)
    const [openPopupAlert, setOpenPopupAlert] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const getGroups = async () => {
            try {
                const res = await axiosPrivate.get('group', { signal: controller.signal })
                isMounted && setGroups(res.data.groups)
            } catch (err) {
                isMounted && setOpenPopupAlert(true)
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
            {
                loading ? 'loading' : <p>{groups && groups.join(', ')}</p>
            }
            <Link to='/chat'>go to chat page</Link>
            <PopupAlert
                title="Server not responding"
                body="The server is not responding at the moment, please try again later."
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
        </div>
    )
}

export default Group