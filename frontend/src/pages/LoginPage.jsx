import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { BACKEND_URL } from '../config';
import './LoginRegisterPage.css';

function LoginPage (props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            let hasError = false;
            const response = await fetch(`${BACKEND_URL}/users/${username}?password=${password}`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                },
            });
            if (! response.ok)
                hasError = true;

            const responseData = await response.json();
            if (hasError)
                throw new Error(responseData.message);

            setUser(responseData.userInfo);
            navigate("/mainPage");
        }
        catch (error) {
            alert(error.message);
        }
      };

    return (
        <div className="loginContainer">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/registerPage">Register</Link>
            </p>
        </div>
    );
}

export default LoginPage;