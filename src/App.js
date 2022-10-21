import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Root from "./components/Root"
import Chat from "./Pages/Chat"
import ErrorPage from "./Pages/ErrorPage"
import Group from "./Pages/Group"
import Login from "./Pages/Login"
import Register from "./Pages/Register"

const router = createBrowserRouter([
    {
        errorElement: <ErrorPage />,
        children: [
            { path: '/', element: <Login /> },
            { path: '/register', element: <Register /> },
            {
                element: <Root />,
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