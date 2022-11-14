import { useContext } from "react"
import { SocketContext } from "../SocketProvider"

export default function useSocket() {
    return useContext(SocketContext)
}