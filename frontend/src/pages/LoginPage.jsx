import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BACKEND_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import './LoginRegisterPage.css';

function LoginPage (props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            let hasError = false;
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: POST,
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({username, password})
            });
            if (! response.ok)
                hasError = true;

            const responseData = await response.json();
            if (hasError)
                throw new Error(responseData.message);

            login(responseData.userInfo, responseData.token);
            navigate("/");
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
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default LoginPage;