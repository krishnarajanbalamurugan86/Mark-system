import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { MarksProvider } from './context/MarksContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

console.log("App Title from ENV:", import.meta.env.VITE_APP_TITLE);
console.log("API Base URL from ENV:", import.meta.env.VITE_API_BASE_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/react">
      <AuthProvider>
        <MarksProvider>
          <App />
        </MarksProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
