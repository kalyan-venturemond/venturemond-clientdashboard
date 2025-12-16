import React from 'react';
import { Link } from "react-router-dom";

export function FooterLinks() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary/20 border-t border-border/40 pt-12 md:pt-16 pb-8">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <img src="/logo.png" alt="VentureMond Logo" className="h-8 w-auto" />
                        <span className="text-xl font-bold text-gradient">VentureMond</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        The all-in-one client dashboard for modern agencies and services.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link to="/catalog" className="hover:text-primary transition-colors">Services</Link></li>
                        <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        <li><Link to="/login" className="hover:text-primary transition-colors">Client Portal</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                        <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Legal & Support</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                        <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/support" className="hover:text-primary transition-colors">Support Center</Link></li>
                        <li><Link to="/status" className="hover:text-primary transition-colors">Status Page</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-border/20 text-center text-sm text-muted-foreground">
                © {currentYear} VentureMond. All rights reserved.
            </div>
        </footer>
    );
}
