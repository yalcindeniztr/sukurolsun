import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './core/ThemeContext';
import { LanguageProvider } from './core/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <ThemeProvider>
                <LanguageProvider>
                    <App />
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
