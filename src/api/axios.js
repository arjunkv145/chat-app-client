import axios from "axios";

export default axios.create({
    baseURL: REACT_APP_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});