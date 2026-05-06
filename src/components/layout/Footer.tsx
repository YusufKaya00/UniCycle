'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-card border-t border-border/40 py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
                    {/* Logo & Description */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-glow">
                                <span className="text-xl">🚴</span>
                            </div>
                            <span className="font-extrabold text-xl text-foreground tracking-tight">UniCycle</span>
                        </div>
                        <p className="text-sm text-muted max-w-xs font-medium leading-relaxed">
                            {t('footer.tagline') || 'The trusted marketplace for the university community.'}
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-muted uppercase tracking-widest">
                        <a href="#" className="hover:text-primary transition-all duration-300">{t('footer.about')}</a>
                        <a href="#" className="hover:text-primary transition-all duration-300">{t('footer.privacy')}</a>
                        <a href="#" className="hover:text-primary transition-all duration-300">{t('footer.terms')}</a>
                        <a href="#" className="hover:text-primary transition-all duration-300">{t('footer.contact')}</a>
                    </div>

                    {/* Copyright */}
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <p className="text-sm font-bold text-foreground">
                            {t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}
                        </p>
                        <p className="text-[10px] text-muted font-bold tracking-[0.2em] uppercase">
                            Made with ❤️ for Students
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
