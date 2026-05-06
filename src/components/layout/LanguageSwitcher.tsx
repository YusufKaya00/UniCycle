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
        <div className="flex items-center bg-secondary/80 backdrop-blur-sm p-1 rounded-xl border border-border/50">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all duration-200 ${language === lang.code
                            ? 'bg-card text-primary shadow-sm'
                            : 'text-muted hover:text-foreground'
                        }`}
                    title={lang.code === 'en' ? 'English' : 'Latviešu'}
                >
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <span className="uppercase">{lang.label}</span>
                </button>
            ))}
        </div>
    );
}
