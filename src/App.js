import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Root from "./components/Root"
import Chat from "./Pages/Chat"
import ErrorPage from "./Pages/ErrorPage"
import Group from "./Pages/Group"
import Login from "./Pages/Login"
import Register from "./Pages/Register"

const router = createBrowserRouter([
    {
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            { path: '/', element: <Chat /> },
            { path: '/group', element: <Group /> },
        ]
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
])

function App() {
    return <RouterProvider router={router} />
}

export default App