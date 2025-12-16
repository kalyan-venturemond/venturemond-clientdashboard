import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DrillDownProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: "storage" | "files" | "users" | "sla" | null;
}

export function AnalyticsDrillDown({ open, onOpenChange, type }: DrillDownProps) {
    if (!type) return null;

    const renderContent = () => {
        switch (type) {
            case "storage":
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle>Storage Details</DialogTitle>
                            <DialogDescription>Breakdown of storage usage by folder/type.</DialogDescription>
                        </DialogHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Files</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Usage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">/projects/design-assets</TableCell>
                                    <TableCell>450</TableCell>
                                    <TableCell>24.5 GB</TableCell>
                                    <TableCell>47.1%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">/projects/videos</TableCell>
                                    <TableCell>12</TableCell>
                                    <TableCell>15.2 GB</TableCell>
                                    <TableCell>29.2%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">/documents/contracts</TableCell>
                                    <TableCell>128</TableCell>
                                    <TableCell>8.5 GB</TableCell>
                                    <TableCell>16.3%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">/shared</TableCell>
                                    <TableCell>89</TableCell>
                                    <TableCell>3.8 GB</TableCell>
                                    <TableCell>7.3%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                );
            case "files":
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle>File Activity Log</DialogTitle>
                            <DialogDescription>Recent uploads and downloads.</DialogDescription>
                        </DialogHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">annual-report-2023.pdf</TableCell>
                                    <TableCell><Badge variant="outline" className="text-blue-600 bg-blue-50">Download</Badge></TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>Today, 10:23 AM</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">logo-branding.zip</TableCell>
                                    <TableCell><Badge variant="outline" className="text-green-600 bg-green-50">Upload</Badge></TableCell>
                                    <TableCell>Sarah Smith</TableCell>
                                    <TableCell>Yesterday, 4:15 PM</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">contract_v2.docx</TableCell>
                                    <TableCell><Badge variant="outline" className="text-blue-600 bg-blue-50">Download</Badge></TableCell>
                                    <TableCell>Mike Johnson</TableCell>
                                    <TableCell>Dec 12, 09:30 AM</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                );
            case "users":
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle>Active Users</DialogTitle>
                            <DialogDescription>Users active in the current period.</DialogDescription>
                        </DialogHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">John Doe</TableCell>
                                    <TableCell>Admin</TableCell>
                                    <TableCell>Just now</TableCell>
                                    <TableCell>142</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Sarah Smith</TableCell>
                                    <TableCell>Editor</TableCell>
                                    <TableCell>2 hours ago</TableCell>
                                    <TableCell>89</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Mike Johnson</TableCell>
                                    <TableCell>Viewer</TableCell>
                                    <TableCell>5 hours ago</TableCell>
                                    <TableCell>34</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                );
            case "sla":
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle>SLA Breaches</DialogTitle>
                            <DialogDescription>Tickets that exceeded response time targets.</DialogDescription>
                        </DialogHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ticket ID</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Response Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">#T-10234</TableCell>
                                    <TableCell>Server connectivity issue</TableCell>
                                    <TableCell className="text-red-600">4.5h (Target: 2h)</TableCell>
                                    <TableCell><Badge>Resolved</Badge></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">#T-10112</TableCell>
                                    <TableCell>Billing inquiry discrepancy</TableCell>
                                    <TableCell className="text-red-600">26h (Target: 24h)</TableCell>
                                    <TableCell><Badge variant="secondary">Closed</Badge></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                )
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
}
