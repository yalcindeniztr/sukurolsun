import React, { useState, useEffect, useRef } from 'react';
import { Lock, Delete, ShieldCheck } from 'lucide-react';
import { storageService } from '../services/storage.service';

interface PinLockScreenProps {
    onUnlock: () => void;
}

const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlock }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const maxLength = 4;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (pin.length === maxLength) {
            handleVerify();
        }
    }, [pin]);

    const handleVerify = async () => {
        const isValid = await storageService.verifyPin(pin);
        if (isValid) {
            onUnlock();
        } else {
            setError(true);
            setShake(true);
            setTimeout(() => {
                setPin('');
                setShake(false);
                setError(false);
            }, 600);
        }
    };

    const handleDigit = (digit: string) => {
        if (pin.length < maxLength) {
            setPin(prev => prev + digit);
            setError(false);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError(false);
    };

    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

    return (
        <div className="min-h-screen bg-[#f0fdf4] flex flex-col items-center justify-center p-6 select-none">
            {/* Dekoratif Arka Plan */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-[120px] bg-emerald-300/20 animate-pulse" />
                <div className="absolute bottom-40 left-10 w-56 h-56 rounded-full blur-[100px] bg-amber-300/10 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
                {/* İkon */}
                <div className="mb-8 p-5 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200"
                    style={{ boxShadow: '0 0 30px -5px rgba(16,185,129,0.15)' }}>
                    {error ? <Lock className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                </div>

                {/* Başlık */}
                <h1 className="text-2xl font-serif font-bold text-slate-800 mb-2">Şükür Olsun</h1>
                <p className="text-sm text-slate-500 mb-10">
                    {error ? 'Yanlış PIN. Tekrar deneyin.' : 'PIN kodunuzu girin'}
                </p>

                {/* PIN Dots */}
                <div
                    ref={containerRef}
                    className={`flex gap-5 mb-12 ${shake ? 'animate-shake' : ''}`}
                    style={shake ? { animation: 'shake 0.5s ease-in-out' } : undefined}
                >
                    {Array.from({ length: maxLength }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${i < pin.length
                                    ? error
                                        ? 'bg-red-400 scale-125 shadow-lg shadow-red-400/30'
                                        : 'bg-emerald-500 scale-125 shadow-lg shadow-emerald-500/30'
                                    : 'bg-slate-200 border border-slate-300'
                                }`}
                        />
                    ))}
                </div>

                {/* Numpad */}
                <div className="grid grid-cols-3 gap-4 w-full">
                    {digits.map((digit, i) => {
                        if (digit === '') return <div key={i} />;
                        if (digit === 'del') {
                            return (
                                <button
                                    key={i}
                                    onClick={handleDelete}
                                    className="aspect-square flex items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-100 active:scale-90 transition-all"
                                >
                                    <Delete className="w-6 h-6" />
                                </button>
                            );
                        }
                        return (
                            <button
                                key={i}
                                onClick={() => handleDigit(digit)}
                                className="aspect-square flex items-center justify-center rounded-2xl text-2xl font-bold text-slate-700
                  bg-white border border-slate-200 hover:bg-emerald-50 active:scale-90 active:bg-emerald-100
                  transition-all duration-150 shadow-sm"
                            >
                                {digit}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Shake Animasyonu */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default PinLockScreen;
