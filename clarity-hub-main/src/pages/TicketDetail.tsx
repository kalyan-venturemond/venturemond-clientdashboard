import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Clock,
    Paperclip,
    Send,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    FileText,
    User,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const mockTicket = {
    id: "TKT-001",
    subject: "Cannot access project files",
    category: "Technical",
    priority: "high",
    status: "open",
    created: "2024-03-20T10:00:00",
    lastUpdated: "2024-03-20T11:30:00",
    slaDeadline: "2024-03-20T18:00:00", // 8 hours SLA
    description: "I'm trying to access the files in Project Alpha but getting a permission error (403 Forbidden). This started happening after the recent update this morning. I need access urgently to complete my deliverables.",
    attachments: [
        { name: "error_screenshot.png", size: "1.2 MB" },
        { name: "console_log.txt", size: "45 KB" }
    ],
    timeline: [
        { status: "created", date: "2024-03-20T10:00:00", text: "Ticket created" },
        { status: "assigned", date: "2024-03-20T10:15:00", text: "Assigned to Sarah Support" },
        { status: "in-progress", date: "2024-03-20T10:30:00", text: "Investigation started" },
    ],
    messages: [
        {
            id: 1,
            sender: "client",
            name: "John Doe",
            message: "I'm trying to access the files in Project Alpha but getting a permission error (403 Forbidden). This started happening after the recent update this morning. I need access urgently to complete my deliverables.",
            timestamp: "2024-03-20T10:00:00",
            attachments: []
        },
        {
            id: 2,
            sender: "support",
            name: "Sarah Support",
            message: "Hi John, thanks for reporting this. I've escalated this to our engineering team. We suspect it might be related to the permissions migration. Could you please clear your cache and try again while we investigate?",
            timestamp: "2024-03-20T10:30:00",
            attachments: []
        }
    ]
};

const statusConfig = {
    open: { label: "Open", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
    "in-progress": { label: "In Progress", color: "bg-info/10 text-info", icon: Clock },
    pending: { label: "Pending", color: "bg-warning/10 text-warning", icon: Clock },
    resolved: { label: "Resolved", color: "bg-success/10 text-success", icon: CheckCircle2 },
};

const priorityConfig = {
    high: { label: "High", color: "bg-destructive/10 text-destructive" },
    medium: { label: "Medium", color: "bg-warning/10 text-warning" },
    low: { label: "Low", color: "bg-muted text-muted-foreground" },
};

export default function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [replyText, setReplyText] = useState("");
    const [messages, setMessages] = useState(mockTicket.messages);

    const handleSendReply = () => {
        if (!replyText.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: "client",
            name: "John Doe",
            message: replyText,
            timestamp: new Date().toISOString(),
            attachments: []
        };

        setMessages([...messages, newMessage]);
        setReplyText("");
        toast({
            title: "Reply sent",
            description: "Your message has been added to the ticket.",
        });
    };

    const handleCloseTicket = () => {
        toast({
            title: "Ticket Closed",
            description: "This ticket has been marked as resolved."
        });
        navigate("/support");
    }

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/support")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold">{mockTicket.subject}</h1>
                            <Badge variant="outline" className="text-muted-foreground font-normal">
                                #{id || mockTicket.id}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <User className="h-3 w-3" /> {mockTicket.category}
                            </span>
                            <span>•</span>
                            <span>Created {new Date(mockTicket.created).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className={cn("font-medium", statusConfig[mockTicket.status as keyof typeof statusConfig].color)}>
                        {statusConfig[mockTicket.status as keyof typeof statusConfig].label}
                    </Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleCloseTicket} className="text-destructive focus:text-destructive">
                                Close Ticket
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content: Conversation */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Ticket Description Card */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-base font-medium">Description</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <p className="text-sm leading-relaxed text-foreground/90">
                                {mockTicket.description}
                            </p>
                            {mockTicket.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {mockTicket.attachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 border rounded-md text-xs hover:bg-muted/50 transition-colors cursor-pointer group">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span>{file.name}</span>
                                            <span className="text-muted-foreground ml-1">({file.size})</span>
                                            <Download className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Conversation Thread */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pl-1">Discussion</h3>

                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("flex gap-4 max-w-[85%]", msg.sender === "client" ? "ml-auto flex-row-reverse" : "")}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
                                    msg.sender === "client" ? "bg-primary text-primary-foreground border-primary" : "bg-accent/10 text-accent border-accent/20"
                                )}>
                                    {msg.name.charAt(0)}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-xl text-sm space-y-1 shadow-sm border",
                                    msg.sender === "client" ? "bg-primary/5 border-primary/10 rounded-tr-none" : "bg-card border-border rounded-tl-none"
                                )}>
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <span className="font-semibold">{msg.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="leading-relaxed">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Area */}
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <Textarea
                                placeholder="Write a reply..."
                                className="min-h-[100px] resize-none border-0 focus-visible:ring-0 px-0"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="flex items-center justify-between border-t pt-4">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                    <Paperclip className="h-4 w-4 mr-2" />
                                    Attach files
                                </Button>
                                <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Reply
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Details & Timeline */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Ticket Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Priority</p>
                                    <Badge
                                        className={cn(
                                            "font-normal",
                                            priorityConfig[mockTicket.priority as keyof typeof priorityConfig].color
                                        )}
                                    >
                                        {priorityConfig[mockTicket.priority as keyof typeof priorityConfig].label}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">SLA Remaining</p>
                                    <div className="flex items-center gap-1.5 text-warning font-medium">
                                        <Clock className="h-3.5 w-3.5" />
                                        6h 30m
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Project</p>
                                    <p className="font-medium">Project Alpha</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Environment</p>
                                    <p className="font-medium">Production</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Created</span>
                                    <span>{new Date(mockTicket.created).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Last Updated</span>
                                    <span>{new Date(mockTicket.lastUpdated).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative space-y-6 pl-4 border-l-2 border-muted ml-2">
                                {mockTicket.timeline.map((event, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground/30 ring-4 ring-background" />
                                        <div className="text-sm font-medium">{event.text}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
