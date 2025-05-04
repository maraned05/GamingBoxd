import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from './contexts/UserContext';

import './index.css';
import App from './App';

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </React.StrictMode>
);