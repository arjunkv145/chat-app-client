import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/Layout"
import AuthRoute from "./components/AuthRoute"
import Chat from "./Pages/Chat"
import ErrorPage from "./Pages/ErrorPage"
import Group from "./Pages/Group"
import Login from "./Pages/Login"
import Register from "./Pages/Register"

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthRoute />,
        errorElement: <ErrorPage />,
        children: [
            { path: '/', element: <Login /> },
            { path: '/register', element: <Register /> },
            {
                element: <Layout />,
                children: [
                    { path: '/chat', element: <Chat /> },
                    { path: '/group', element: <Group /> },
                ]
            }
        ]
    }
])

function App() {
    return <RouterProvider router={router} />
}

export default App