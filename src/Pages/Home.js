import "./sassStyles/home.scss";
import { useContext, useEffect } from "react";
import { removeJWT, UserContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

function Home() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (user.isLoggedIn === false) {
            navigate('/login');
        }
    }, [navigate, user.isLoggedIn])

    const logout = () => {
        removeJWT();
        setUser(prev => ({
            ...prev,
            user: null,
            isLoggedIn: false
        }));
    }

    return (
        <div className="home-page">
            Home page
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Home;