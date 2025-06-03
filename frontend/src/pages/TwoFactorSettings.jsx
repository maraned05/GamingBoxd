import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { BACKEND_URL } from '../config';
import './AuthenticationPages.css';

export const TwoFactorSettings = () => {
    const { user } = useAuth();
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEnable2FA = async () => {
        try {
            setError('');
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/auth/enable-2fa`, {
                method: 'POST',
                headers: {
                    ...authService.getAuthHeader(),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to enable 2FA');
            }
            setSuccess('2FA has been enabled.');
            

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDisable2FA = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const response = await fetch(`${API_URL}/api/auth/disable-2fa`, {
                method: 'POST',
                headers: {
                    ...authService.getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                //body: JSON.stringify({ verificationCode }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to disable 2FA');
            }

            setSuccess('2FA has been disabled successfully.');
            setVerificationCode('');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loginContainer">
            <h2>Two-Factor Authentication Settings</h2>
            
            {error && (
                <div className='errorMessage'> {error} </div>
            )}
            
            {success && (
                <div className='successMessage'> {success} </div>
            )}

            <p> 
                Current Status: <span> {user.twoFactorEnabled ? 'Enabled' : 'Disabled'} </span> 
            </p>

            {!user.twoFactorEnabled ? 
            (
                <button onClick={handleEnable2FA} disabled={loading} >
                    {loading ? 'Enabling...' : 'Enable 2FA'}
                </button> 
            ) : (
                <button onClick={handleDisable2FA} disabled={loading} >
                    {loading ? 'Disabling...' : 'Disable 2FA'}
                </button>
                // <form onSubmit={handleDisable2FA}>
                //     <input
                //         type="text"
                //         id="code"
                //         value={verificationCode}
                //         onChange={(e) => setVerificationCode(e.target.value)}
                //         placeholder="Enter verification code"
                //         required
                //     />
                //     <button type="submit" disabled={loading} >
                //         {loading ? 'Disabling...' : 'Disable 2FA'}
                //     </button>
                // </form>
            )}
        </div>
    );
}; 