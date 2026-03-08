import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
export type BgImage = 'default' | 'kabe' | 'nebevi' | 'nature';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    bgImage: BgImage;
    setBgImage: (img: BgImage) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
    bgImage: 'default',
    setBgImage: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Sabit açık tema — koyu tema kaldırıldı
    const theme: Theme = 'light';
    const toggleTheme = () => { }; // Artık kullanılmıyor

    const [bgImage, setBgImageState] = useState<BgImage>('default');

    useEffect(() => {
        const savedBg = localStorage.getItem('sukurolsun_theme_bg') as BgImage;
        if (savedBg && ['default', 'kabe', 'nebevi', 'nature'].includes(savedBg)) {
            setBgImageState(savedBg);
        }
    }, []);

    const setBgImage = (img: BgImage) => {
        setBgImageState(img);
        localStorage.setItem('sukurolsun_theme_bg', img);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, bgImage, setBgImage }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
