import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Plus, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IntegrationCardProps {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    connected: boolean;
    account?: string;
    onConnect: (id: string) => void;
    onDisconnect: (id: string) => void;
    onSettings: (id: string) => void;
    loading?: boolean;
}

export function IntegrationCard({
    id,
    name,
    description,
    icon: Icon,
    connected,
    account,
    onConnect,
    onDisconnect,
    onSettings,
    loading
}: IntegrationCardProps) {
    return (
        <div className="dashboard-card flex flex-col justify-between h-full bg-card hover:shadow-md transition-shadow">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-muted/50">
                        <Icon className="h-8 w-8 text-foreground/80" />
                    </div>
                    {connected ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Connected
                        </Badge>
                    ) : (
                        <div className="h-6" /> // spacer
                    )}
                </div>

                <div>
                    <h3 className="font-semibold text-lg">{name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t flex items-center justify-between">
                {connected ? (
                    <>
                        <div className="text-sm font-medium text-muted-foreground truncate max-w-[120px]" title={account}>
                            {account || "Connected"}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onSettings(id)}
                                disabled={loading}
                            >
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Settings</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onDisconnect(id)}
                                disabled={loading}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Disconnect</span>
                            </Button>
                        </div>
                    </>
                ) : (
                    <Button
                        className="w-full"
                        onClick={() => onConnect(id)}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Connect
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
