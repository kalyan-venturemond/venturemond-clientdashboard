import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
    title: string;
    description: string;
    price?: string;
    features?: string[];
    icon?: React.ReactNode;
    link?: string;
}

export function ServiceCard({ title, description, price, features, icon, link = "/catalog" }: ServiceCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-border/50">
            <CardHeader>
                <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">{description}</p>
            </CardHeader>
            <CardContent className="flex-1">
                {price && (
                    <div className="mb-4">
                        <span className="text-2xl font-bold">{price}</span>
                        <span className="text-muted-foreground text-sm">/month</span>
                    </div>
                )}
                {features && (
                    <ul className="space-y-2">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="h-4 w-4 text-primary" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
            <CardFooter>
                <Button className="w-full group" asChild>
                    <Link to={link}>
                        View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
