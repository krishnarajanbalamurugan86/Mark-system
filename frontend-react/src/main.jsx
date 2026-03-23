import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { MarksProvider } from './context/MarksContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

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
