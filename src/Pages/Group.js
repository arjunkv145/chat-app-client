import React, { useEffect, useState } from 'react'
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
        <>
            <main className='group-container'>
                <h1 className='title'>Group</h1>
                {
                    loading ? 'loading' : <p>{groups && groups.join(', ')}</p>
                }
            </main>
            <PopupAlert
                title="Server not responding"
                body="The server is not responding at the moment, please try again later."
                openPopupAlert={openPopupAlert}
                setOpenPopupAlert={setOpenPopupAlert}
            />
        </>
    )
}

export default Group