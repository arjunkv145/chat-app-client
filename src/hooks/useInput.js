import React, { useState } from 'react'

function useInput(props) {
    const { type } = props
    const [input, setInput] = useState('')
}

export default useInput