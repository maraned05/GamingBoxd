import { useEffect, useState } from "react";

export function useConnectivityStatus (API_URL) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [backendStatus, setBackendStatus] = useState('checking');

    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const res = await fetch(`${API_URL}/`, { timeout: 3000 });
                if (res.ok) 
                    setBackendStatus('ok');
                else
                    setBackendStatus('down');
                
            } catch (err) {
                setBackendStatus('down');
            }
        }

        checkBackend();
        const interval = setInterval(checkBackend, 5000); // every 5s

        return () => clearInterval(interval);

    }, [API_URL]);

    return { isOnline, backendStatus };
};