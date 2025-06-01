import React, { useState, useEffect } from "react";
import "./AdminDashboard.css"
import { BACKEND_URL } from '../config';
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";

function AdminDashboard () {
    const [monitoredUsers, setMonitoredUsers] = useState([]);
    //const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMonitoredUsers = async () => {
            try {
                if (user) {
                    const response = await fetch(`${BACKEND_URL}/admin/monitoredUsers`, {
                      method: 'GET',
                      headers: {
                        ...authService.getAuthHeader()
                      }
                    });
                    console.log(response);

                    if (!response.ok) 
                        throw new Error('Failed to fetch monitored users');

                    const data = await response.json();
                    setMonitoredUsers(data.users);
                }
            } catch (err) {
                alert(err.message);
            }
        };

        fetchMonitoredUsers();
    }, [user]);

    return (
        <div className="monitored-users-container">
          <h2>Monitored Users</h2>
          {/* {error && <p className="error">{error}</p>} */}
          {monitoredUsers.length === 0 ? (
            <p>No suspicious activity detected.</p>
          ) : (
            <ul className="user-list">
              {monitoredUsers.map((user) => (
                <li key={user.username} className="user-card">
                  <strong>{user.username}</strong>
                  <span>Last detected: {new Date(user.lastDetected).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
}

export default AdminDashboard;