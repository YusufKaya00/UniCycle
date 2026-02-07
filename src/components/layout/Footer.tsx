export default function Footer() {
    return (
        <footer className="bg-card border-t border-border py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo & Description */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                            <span className="text-base">🚴</span>
                        </div>
                        <div>
                            <span className="font-bold text-foreground">UniCycle</span>
                            <p className="text-xs text-muted">Sustainable Student Marketplace</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted">
                        <a href="#" className="hover:text-foreground transition-colors">About</a>
                        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                        <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                    </div>

                    {/* Copyright */}
                    <p className="text-xs text-muted">
                        © {new Date().getFullYear()} UniCycle. RTU Students.
                    </p>
                </div>
            </div>
        </footer>
    );
}
