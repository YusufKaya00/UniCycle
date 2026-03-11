'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-white border-t border-border py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo & Description */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center shadow-sm">
                            <span className="text-lg">🚴</span>
                        </div>
                        <div>
                            <span className="font-bold text-foreground tracking-tight">UniCycle</span>
                            <p className="text-xs text-muted">{t('footer.tagline')}</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted">
                        <a href="#" className="hover:text-foreground transition-colors">{t('footer.about')}</a>
                        <a href="#" className="hover:text-foreground transition-colors">{t('footer.privacy')}</a>
                        <a href="#" className="hover:text-foreground transition-colors">{t('footer.terms')}</a>
                        <a href="#" className="hover:text-foreground transition-colors">{t('footer.contact')}</a>
                    </div>

                    {/* Copyright */}
                    <p className="text-xs text-muted">
                        {t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}
                    </p>
                </div>
            </div>
        </footer>
    );
}
