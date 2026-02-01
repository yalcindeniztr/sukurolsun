import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md animate-slide-up border transition-all duration-300
      ${type === 'success'
                ? 'bg-primary/20 border-primary/30 text-white'
                : 'bg-rose-500/20 border-rose-500/30 text-white'
            }`}
        >
            {type === 'success' ? <CheckCircle className="text-primary-light" /> : <XCircle className="text-rose-400" />}
            <span className="font-medium tracking-wide">{message}</span>
        </div>
    );
};

export default Toast;
