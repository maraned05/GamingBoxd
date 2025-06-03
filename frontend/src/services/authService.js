const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const authService = {
    getAuthHeader() {
        const tempToken = localStorage.getItem('tempToken');
        const token = localStorage.getItem('token');
        return tempToken ? { Authorization: `Bearer ${tempToken}` } 
                : token ? { Authorization: `Bearer ${token}` } : {};
    }
}; 