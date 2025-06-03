import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BACKEND_URL } from '../config';
import { authService } from '../services/authService';
import './AuthenticationPages.css';

export const TwoFactorVerification = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, tempToken } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/auth/verify-2fa`, {
                method: 'POST',
                headers: {
                    ...authService.getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to verify code');
            }

            login(responseData.userInfo, responseData.token);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Redirect to login if no temp token is present
    if (!tempToken) {
        navigate('/login');
        return null;
    }

    return (
        <div className="loginContainer">
            <h2>
                Two-Factor Authentication
            </h2>
            <p>
                Please enter the verification code sent to your email
            </p>
            {error && (
                <div className='errorMessage'> {error} </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </form>
        </div>
    );
}; 