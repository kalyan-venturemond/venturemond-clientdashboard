import React from 'react';

interface StepCardProps {
    number: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

export function StepCard({ number, title, description, icon }: StepCardProps) {
    return (
        <div className="relative flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-secondary/30 border border-border/50">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {number}
            </div>
            <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center text-primary shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground text-sm">
                {description}
            </p>
        </div>
    );
}
