import React, { useState, useEffect } from "react";
import "./AdminDashboard.css"
import { useUser } from "../contexts/UserContext";
import { BACKEND_URL } from '../config';

function AdminDashboard () {
    const [monitoredUsers, setMonitoredUsers] = useState([]);
    //const [error, setError] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchMonitoredUsers = async () => {
            try {
                if (user) {
                    const response = await fetch(`${BACKEND_URL}/admin/${user.username}/monitoredUsers`);
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