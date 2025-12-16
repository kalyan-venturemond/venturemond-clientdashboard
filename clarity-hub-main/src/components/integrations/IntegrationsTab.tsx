import {
    Slack,
    Mail,
    Calendar,
} from "lucide-react";
import { useState } from "react";
import { IntegrationCard } from "./IntegrationCard";
import { IntegrationSettingsModal } from "./IntegrationSettingsModal";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Initial Mock Data
const initialIntegrations = [
    {
        id: "slack",
        name: "Slack",
        description: "Get notifications and updates in Slack channels.",
        icon: Slack,
        connected: false,
        account: null as string | null,
        provider: "slack"
    },
    {
        id: "teams",
        name: "Microsoft Teams",
        description: "Integrate with MS Teams for collaboration.",
        icon: Mail, // Using Mail as placeholder for Teams if specific icon unavailable, butlucide has no Teams icon. Users usually use generic or imported SVG. Sticking to Mail/Users or similar.
        connected: false,
        account: null as string | null,
        provider: "teams"
    },
    {
        id: "gcal",
        name: "Google Calendar",
        description: "Sync meetings and deadlines to your calendar.",
        icon: Calendar,
        connected: true,
        account: "john@company.com",
        provider: "google"
    },
    {
        id: "outlook",
        name: "Outlook Calendar",
        description: "Connect your Outlook calendar for automatic syncing.",
        icon: Mail,
        connected: false,
        account: null as string | null,
        provider: "microsoft"
    },
];

export function IntegrationsTab() {
    const [integrations, setIntegrations] = useState(initialIntegrations);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [settingsId, setSettingsId] = useState<string | null>(null);
    const [disconnectId, setDisconnectId] = useState<string | null>(null);

    const { toast } = useToast();

    const handleConnect = (id: string) => {
        setLoadingId(id);

        // Simulate OAuth Popup Flow
        const width = 600;
        const height = 700;
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);

        // In a real app, this would be a real window.open to the backend OAuth start
        // const popup = window.open(`/api/auth/${id}/start`, "oauth", `width=${width},height=${height},top=${top},left=${left}`);

        // Mocking the async success
        setTimeout(() => {
            setLoadingId(null);
            setIntegrations(prev => prev.map(int => {
                if (int.id === id) {
                    return {
                        ...int,
                        connected: true,
                        account: id === "slack" ? "acme-corp" : "user@example.com"
                    };
                }
                return int;
            }));
            toast({
                title: "Integration Connected",
                description: `${integrations.find(i => i.id === id)?.name} has been successfully connected.`,
            });
        }, 2000);
    };

    const confirmDisconnect = () => {
        if (!disconnectId) return;

        const integrationToDisconnect = integrations.find(i => i.id === disconnectId);
        setIntegrations(prev => prev.map(int => {
            if (int.id === disconnectId) {
                return { ...int, connected: false, account: null };
            }
            return int;
        }));

        setDisconnectId(null);
        toast({
            title: "Disconnected",
            description: `${integrationToDisconnect?.name} has been disconnected.`,
        });
    };

    return (
        <div className="grid gap-6 sm:grid-cols-2 animate-fade-in">
            {integrations.map((int) => (
                <IntegrationCard
                    key={int.id}
                    {...int}
                    onConnect={handleConnect}
                    onDisconnect={(id) => setDisconnectId(id)}
                    onSettings={(id) => setSettingsId(id)}
                    loading={loadingId === int.id}
                />
            ))}

            {/* Settings Modal */}
            {settingsId && (
                <IntegrationSettingsModal
                    open={!!settingsId}
                    onOpenChange={(val) => !val && setSettingsId(null)}
                    integrationId={settingsId}
                    integrationName={integrations.find(i => i.id === settingsId)?.name || ""}
                />
            )}

            {/* Disconnect Alert */}
            <AlertDialog open={!!disconnectId} onOpenChange={(val) => !val && setDisconnectId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Disconnect Integration?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to disconnect {integrations.find(i => i.id === disconnectId)?.name}?
                            This will stop syncs and notifications for your workspace.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDisconnect} className="bg-destructive hover:bg-destructive/90">
                            Disconnect
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
