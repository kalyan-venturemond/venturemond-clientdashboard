import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Smartphone, Globe, Trash2, Plus, Clock, Save, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MFAConfigModal } from "./MFAConfigModal";

export function SecurityTab() {
    const [mfaEnabled, setMfaEnabled] = useState(true);
    const [mfaModalOpen, setMfaModalOpen] = useState(false);
    const [ipList, setIpList] = useState<{ ip: string, added: string }[]>([
        { ip: "203.0.113.45", added: "Jan 12, 2024" }
    ]);
    const [newIp, setNewIp] = useState("");
    const [sessionTimeout, setSessionTimeout] = useState(30);
    const [savingSession, setSavingSession] = useState(false);

    const { toast } = useToast();

    const handleAddIp = () => {
        // Basic IP validation
        const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/;
        if (!ipRegex.test(newIp)) {
            toast({ variant: "destructive", title: "Invalid IP Format", description: "Please enter a valid IP address or CIDR range." });
            return;
        }

        setIpList([...ipList, { ip: newIp, added: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }]);
        setNewIp("");
        toast({ title: "IP Added", description: `${newIp} has been whitelisted.` });
    };

    const handleRemoveIp = (ipToRemove: string) => {
        setIpList(ipList.filter(item => item.ip !== ipToRemove));
        toast({ title: "IP Removed", description: "Access from this IP is no longer restricted." });
    };

    const handleSaveSession = () => {
        setSavingSession(true);
        setTimeout(() => {
            setSavingSession(false);
            toast({ title: "Settings Updated", description: "Session security preferences saved." });
        }, 800);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">

            {/* MFA Section */}
            <section className="dashboard-card">
                <h2 className="section-title flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Multi-Factor Authentication
                </h2>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background border rounded-xl gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${mfaEnabled ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                            <Smartphone className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">MFA is {mfaEnabled ? "Enabled" : "Disabled"}</h3>
                                {mfaEnabled && <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full font-medium">Active</span>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {mfaEnabled ? "Your account is protected with 2-step verification." : "We recommend enabling MFA for better security."}
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => setMfaModalOpen(true)} variant={mfaEnabled ? "outline" : "default"}>
                        {mfaEnabled ? "Configure" : "Enable MFA"}
                    </Button>
                </div>
                <MFAConfigModal
                    open={mfaModalOpen}
                    onOpenChange={setMfaModalOpen}
                    isEnabled={mfaEnabled}
                    onStatusChange={setMfaEnabled}
                />
            </section>

            {/* Session Settings */}
            <section className="dashboard-card">
                <h2 className="section-title flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    Session Settings
                </h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base">Session Timeout</Label>
                            <p className="text-sm text-muted-foreground">Automatically log out inactive users (minutes)</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={sessionTimeout}
                                onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                                className="w-24 text-center"
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base">Remember Device</Label>
                            <p className="text-sm text-muted-foreground">Stay logged in on trusted devices</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button onClick={handleSaveSession} disabled={savingSession}>
                            {savingSession && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </section>

            {/* IP Whitelist */}
            <section className="dashboard-card relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Globe className="h-32 w-32" />
                </div>
                <h2 className="section-title flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-primary" />
                    IP Restrictions
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Limit access to your workspace to specific IP addresses.
                    <span className="inline-block ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        Enterprise
                    </span>
                </p>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter IP address (e.g. 192.168.1.1)"
                            value={newIp}
                            onChange={(e) => setNewIp(e.target.value)}
                        />
                        <Button onClick={handleAddIp}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add IP
                        </Button>
                    </div>

                    <div className="rounded-lg border bg-card">
                        {ipList.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-muted">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium font-mono text-sm">{item.ip}</p>
                                        <p className="text-xs text-muted-foreground">Added on {item.added}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleRemoveIp(item.ip)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {ipList.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No IP restrictions configured. Access allowed from anywhere.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Activity Log Audit */}
            <div className="pt-4 pb-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 pl-1">Recent Security Activity</h3>
                <div className="space-y-2">
                    {[
                        { action: "MFA enabled", user: "John Doe", time: "2 days ago" },
                        { action: "Slack integration connected", user: "John Doe", time: "Jan 10, 2024" },
                        { action: "Session timeout updated", user: "Admin", time: "Jan 05, 2024" }
                    ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50 text-muted-foreground">
                            <span>{log.action} <span className="text-muted-foreground/50 mx-1">•</span> {log.user}</span>
                            <span className="text-xs opacity-70">{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
