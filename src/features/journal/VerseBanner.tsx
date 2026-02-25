import React, { useMemo } from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { ANNUAL_VERSES } from '../../core/verses_data';
import { useTheme } from '../../core/ThemeContext';

interface VerseBannerProps {
    specificIndex?: number;
}

const VerseBanner: React.FC<VerseBannerProps> = ({ specificIndex }) => {
    const { theme } = useTheme();

    const verse = useMemo(() => {
        if (specificIndex !== undefined) {
            return ANNUAL_VERSES[specificIndex % ANNUAL_VERSES.length];
        }

        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        const index = dayOfYear % ANNUAL_VERSES.length;
        return ANNUAL_VERSES[index];
    }, [specificIndex]);

    return (
        <div className="relative w-full overflow-hidden rounded-3xl min-h-[200px] lg:min-h-[240px] group transition-all duration-500 hover:scale-[1.01]"
            style={{
                boxShadow: theme === 'light'
                    ? '0 20px 50px -10px rgba(0,0,0,0.08)'
                    : '0 20px 50px -10px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.04)'
            }}
        >
            {/* Background - 3D Depth */}
            <div className={`absolute inset-0 z-0 border transition-colors duration-500
                ${theme === 'light'
                    ? 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-200/60'
                    : 'bg-gradient-to-br from-[#111827] to-[#0f2e22] border-white/[0.06]'}
            `}></div>

            {/* Mesh Gradients */}
            <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent
                ${theme === 'light' ? 'opacity-10' : 'opacity-15'}`}></div>
            <div className={`absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent
                ${theme === 'light' ? 'opacity-8' : 'opacity-10'}`}></div>

            {/* Geometric Pattern */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }}
            ></div>

            {/* Glass Shine */}
            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-[0.06] group-hover:animate-shine" />

            {/* Content */}
            <div className="relative z-10 p-8 lg:p-10 flex flex-col items-center text-center justify-center h-full">
                <div className="mb-6 text-amber-400/70 animate-float">
                    <Quote className="w-10 h-10 rotate-180 fill-current opacity-50" />
                </div>

                <h2 className={`text-xl lg:text-2xl font-serif font-medium leading-relaxed max-w-2xl mx-auto transition-colors duration-300
                    ${theme === 'light' ? 'text-slate-800' : 'text-white'}
                `}>
                    "{verse.text}"
                </h2>

                <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400/50"></div>
                    <div className={`flex items-center gap-2 font-medium text-sm tracking-wider uppercase px-4 py-1.5 rounded-full border
                        ${theme === 'light'
                            ? 'text-amber-600 bg-amber-400/10 border-amber-400/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}
                     `}>
                        <Sparkles className="w-3 h-3" />
                        {verse.source}
                    </div>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400/50"></div>
                </div>
            </div>
        </div>
    );
};

export default VerseBanner;
