import "./sassStyles/home.scss";
import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
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
        localStorage.setItem('jwt', null);
        setUser(prev => ({
            ...prev,
            user: null,
            token: null,
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