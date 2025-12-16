import React from 'react';

interface ScreenshotMockupProps {
    src?: string;
    alt: string;
    caption?: string;
}

export function ScreenshotMockup({ src, alt, caption }: ScreenshotMockupProps) {
    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-lg overflow-hidden border border-border/50 bg-card shadow-2xl">
                <div className="h-8 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                {src ? (
                    <img src={src} alt={alt} className="w-full h-auto object-cover" />
                ) : (
                    <div className="w-full h-[200px] md:h-[300px] flex items-center justify-center bg-secondary/20 text-muted-foreground">
                        <span className="text-sm font-medium">{alt} Preview</span>
                    </div>
                )}
            </div>
            {caption && (
                <p className="text-center text-sm text-muted-foreground mt-4">{caption}</p>
            )}
        </div>
    );
}
