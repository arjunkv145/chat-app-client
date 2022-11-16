import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

function Pending() {
    const [success, setSuccess] = useState(false)
    const [pendingRequest, setPendingRequest] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const controller = new AbortController()
        let isMounted = true

        const fetchData = async () => {
            try {
                const { data } = await axiosPrivate.get('/friend/pending', { signal: controller.signal })
                isMounted && setSuccess(true)
                isMounted && setPendingRequest(data.pendingRequest)
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
                        pendingRequest.map(request => (
                            <div key={request._id}>{request.userName}</div>
                        ))
                    ) : <span>Server not responding</span>
                )
            }
        </div>
    )
}

export default Pending