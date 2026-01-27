import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StrictMode } from 'react';
import AuthProvider from "@/auth/AuthProvider.tsx";
import { HelmetProvider } from "react-helmet-async"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HelmetProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </HelmetProvider>
    </StrictMode>
);
