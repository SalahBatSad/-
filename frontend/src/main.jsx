import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

// ⚠️ ضع هنا معرف العميل الخاص بك من جوجل (Client ID)
// يمكنك وضع أي نص مؤقت للتجربة مثل: "123456789-test.apps.googleusercontent.com"
const GOOGLE_CLIENT_ID = "92968604093-fkiea1uhkmk8h5u4q9vl00m3rhfmmj0e.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);