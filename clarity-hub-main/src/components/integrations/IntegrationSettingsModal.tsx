import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface IntegrationSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    integrationId: string;
    integrationName: string;
}

export function IntegrationSettingsModal({
    open,
    onOpenChange,
    integrationId,
    integrationName,
}: IntegrationSettingsModalProps) {
    const [loading, setLoading] = useState(false);
    const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
    const { toast } = useToast();

    // Reset state on open
    useEffect(() => {
        if (open) {
            setTestStatus("idle");
        }
    }, [open]);

    const handleTest = () => {
        setTestStatus("testing");
        setTimeout(() => {
            // Simulate random success/failure for demo, mostly success
            const isSuccess = Math.random() > 0.1;
            setTestStatus(isSuccess ? "success" : "error");
        }, 1500);
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onOpenChange(false);
            toast({
                title: "Settings saved",
                description: `Preferences for ${integrationName} have been updated.`,
            });
        }, 1000);
    };

    const isSlackOrTeams = integrationId === "slack" || integrationId === "teams";
    const isCalendar = integrationId === "gcal" || integrationId === "outlook";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{integrationName} Settings</DialogTitle>
                    <DialogDescription>
                        Configure how {integrationName} interacts with your workspace.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {isSlackOrTeams && (
                        <>
                            <div className="space-y-2">
                                <Label>Notification Channel</Label>
                                <Select defaultValue="general">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a channel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">#general</SelectItem>
                                        <SelectItem value="projects">#projects</SelectItem>
                                        <SelectItem value="updates">#updates</SelectItem>
                                        <SelectItem value="random">#random</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Where we should post updates.
                                </p>
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enable Notifications</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Receive alerts for project changes.
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="space-y-2">
                                <Label>Notification Level</Label>
                                <Select defaultValue="mentions">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Activity</SelectItem>
                                        <SelectItem value="mentions">Mentions & Important</SelectItem>
                                        <SelectItem value="errors">Errors Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {isCalendar && (
                        <>
                            <div className="space-y-2">
                                <Label>Sync Calendar</Label>
                                <Select defaultValue="primary">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select calendar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="primary">Primary Calendar</SelectItem>
                                        <SelectItem value="work">Work</SelectItem>
                                        <SelectItem value="personal">Personal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto-Sync</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Sync every 15 minutes.
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </>
                    )}

                    <div className="pt-2 border-t">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Connection Test</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTest}
                                disabled={testStatus === "testing"}
                            >
                                {testStatus === "testing" && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                {testStatus === "testing" ? "Testing..." : (isCalendar ? "Test Sync" : "Test Notification")}
                            </Button>

                            {testStatus === "success" && (
                                <div className="flex items-center text-sm text-green-600 animate-in fade-in slide-in-from-left-2">
                                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                    Test successful
                                </div>
                            )}
                            {testStatus === "error" && (
                                <div className="flex items-center text-sm text-destructive animate-in fade-in slide-in-from-left-2">
                                    <AlertCircle className="h-4 w-4 mr-1.5" />
                                    Test failed. Please retry.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
