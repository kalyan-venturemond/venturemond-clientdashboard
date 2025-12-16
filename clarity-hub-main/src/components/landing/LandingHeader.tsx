import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";

export function LandingHeader() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="px-6 h-16 flex items-center justify-between border-b border-border/40 glass sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="VentureMond Logo" className="h-8 w-auto" />
                <span className="text-xl font-bold text-gradient">VentureMond</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
                <Link to="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
                    Services
                </Link>
                <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                    Pricing
                </Link>
                <Link to="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
                    Client Login
                </Link>
                <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                    <Link to="/auth/signup">Get Started</Link>
                </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <div className="flex flex-col gap-6 mt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="/logo.png" alt="VentureMond Logo" className="h-8 w-auto" />
                                <span className="text-xl font-bold text-gradient">VentureMond</span>
                            </div>
                            <nav className="flex flex-col gap-4">
                                <SheetClose asChild>
                                    <Link to="/catalog" className="text-lg font-medium hover:text-primary transition-colors">
                                        Services
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link to="/pricing" className="text-lg font-medium hover:text-primary transition-colors">
                                        Pricing
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link to="/auth/login" className="text-lg font-medium hover:text-primary transition-colors">
                                        Client Login
                                    </Link>
                                </SheetClose>
                            </nav>
                            <div className="mt-4">
                                <SheetClose asChild>
                                    <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" size="lg">
                                        <Link to="/auth/signup">Get Started</Link>
                                    </Button>
                                </SheetClose>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
