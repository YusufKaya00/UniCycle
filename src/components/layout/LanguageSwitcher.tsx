'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Language } from '@/lib/i18n';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const languages: { code: Language; flag: string; label: string }[] = [
        { code: 'en', flag: '🇬🇧', label: 'EN' },
        { code: 'lv', flag: '🇱🇻', label: 'LV' },
    ];

    return (
        <div className="lang-switcher">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`lang-btn ${language === lang.code ? 'lang-btn-active' : ''}`}
                    title={lang.code === 'en' ? 'English' : 'Latviešu'}
                >
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-label">{lang.label}</span>
                </button>
            ))}
        </div>
    );
}
