import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import './LoginRegisterPage.css';

function RegisterPage (props) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userData = { email, username, password, role };
            let hasError = false;
            const response = await fetch(`${BACKEND_URL}/register`, {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json'
                }
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
          <h2>Register</h2>
          <form onSubmit={handleRegister} className="form">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
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
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Register</button>
          </form>
        </div>
      );
}

export default RegisterPage;
