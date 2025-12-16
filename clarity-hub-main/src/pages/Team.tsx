import { useState, useEffect } from "react";
import {
  UserPlus,
  MoreHorizontal,
  Mail,
  Clock,
  Search,
  Users,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RequestSeatsDialog } from "@/components/team/RequestSeatsDialog";
import { InviteMemberDialog } from "@/components/team/InviteMemberDialog";
import { useToast } from "@/hooks/use-toast";
import { teamService, TeamMember } from "@/lib/team";

const pendingInvites = [
  { email: "david@company.com", date: "Oct 24, 2023", expiry: "7 days" },
  { email: "lisa@design.studio", date: "Oct 25, 2023", expiry: "30 days" },
];

const seats = { used: 5, total: 25 };

export default function Team() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [requestSeatsOpen, setRequestSeatsOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(true);
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const data = await teamService.getTeam();
      // Map backend to UI shape (add avatars mock)
      const mapped = data.map(m => ({
        ...m,
        id: m._id,
        name: m.email.split('@')[0], // Mock name from email
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.email}`,
        lastActive: m.status === 'active' ? 'Recently' : 'Invited'
      }));
      setTeamMembers(mapped as any); // Cast for compatibility with UI loop expectation if needed
    } catch (error) {
      console.error("Failed to load team", error);
    }
  };

  const activeUsersCount = teamMembers.filter((m) => m.status === "active").length;

  const roleColors = {
    Admin: "bg-destructive/10 text-destructive border-destructive/20",
    Editor: "bg-info/10 text-info border-info/20",
    Viewer: "bg-secondary text-muted-foreground border-secondary",
  };

  const statusColors = {
    active: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    inactive: "bg-muted text-muted-foreground border-border",
  };

  // Handlers can be passed to Invite Dialog if we refactor it, or handled here if dialog emits event
  // For now assuming InviteMemberDialog calls API or we can pass a callback? 
  // Checking InviteMemberDialog implementation usage... 
  // It seems InviteMemberDialog needs to be updated or we implement adding here.
  // We'll expose a refresh function or passing handleInvite to Dialog.


  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Team & Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members, invite users, and track permissions.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="w-full sm:w-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Seat Usage Card */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Seat Usage</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mb-2">
            <span className="text-2xl font-bold">{seats.used}</span>
            <span className="text-muted-foreground"> / {seats.total} seats used</span>
          </div>
          <Progress value={(seats.used / seats.total) * 100} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            Seats allocated as per your subscription.
          </p>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-3">If you need more seats, upgrade your workspace plan.</p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setRequestSeatsOpen(true)}>
              Request More Seats
            </Button>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Active Users</span>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold">{activeUsersCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Team members currently active.</p>
          </div>
          <div className="mt-auto pt-4">
            <div className="flex -space-x-2 overflow-hidden">
              {teamMembers.slice(0, 5).map(m => (
                <Avatar key={m.id} className="inline-block border-2 border-background w-8 h-8 cursor-pointer hover:z-10 transition-transform hover:scale-110">
                  <AvatarImage src={m.avatar} />
                  <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {teamMembers.length > 5 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                  +{teamMembers.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Invites Card */}
        <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Pending Invites</span>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold">{pendingInvites.length + teamMembers.filter(m => m.status === 'pending').length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Awaiting acceptance.</p>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 text-xs text-warning p-2 bg-warning/10 rounded-lg">
              <AlertCircle className="h-3 w-3" />
              <span>{pendingInvites.length} invites expiring soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Invites Section (Collapsible) */}
      {(pendingInvites.length > 0) && (
        <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => setPendingOpen(!pendingOpen)}
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-sm">Pending Invitations ({pendingInvites.length})</h3>
            </div>
            {pendingOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>

          {pendingOpen && (
            <div className="border-t bg-secondary/5">
              {pendingInvites.map((invite, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b last:border-0 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                      {invite.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{invite.email}</p>
                      <p className="text-xs text-muted-foreground">Invited {invite.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">Expires in {invite.expiry}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8" onClick={() => toast({ description: "Resent invitation" })}>Resend</Button>
                      <Button size="sm" variant="ghost" className="h-8 text-destructive hover:text-destructive" onClick={() => toast({ description: "Invitation revoked" })}>Revoke</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Team Member List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search members..." className="pl-9" />
          </div>
        </div>

        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block border rounded-xl bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 border-b">
              <tr>
                <th className="font-medium text-muted-foreground p-4">Member</th>
                <th className="font-medium text-muted-foreground p-4">Role</th>
                <th className="font-medium text-muted-foreground p-4">Status</th>
                <th className="font-medium text-muted-foreground p-4">Last Active</th>
                <th className="font-medium text-muted-foreground p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={cn("capitalize px-2 py-0.5 rounded-full", roleColors[member.role as keyof typeof roleColors])}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", member.status === 'active' ? 'bg-success' : member.status === 'pending' ? 'bg-warning' : 'bg-muted-foreground')} />
                      <span className={cn("capitalize")}>{member.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {member.lastActive}
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        {member.status === 'pending' && <DropdownMenuItem>Resend Invite</DropdownMenuItem>}
                        <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View - Visible on Mobile */}
        <div className="md:hidden space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-card border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    {member.status === 'pending' && <DropdownMenuItem>Resend Invite</DropdownMenuItem>}
                    <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant="outline" className={cn("capitalize px-2 py-0.5 rounded-full", roleColors[member.role as keyof typeof roleColors])}>
                  {member.role}
                </Badge>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className={cn("h-1.5 w-1.5 rounded-full", member.status === 'active' ? 'bg-success' : member.status === 'pending' ? 'bg-warning' : 'bg-muted-foreground')} />
                  <span className="capitalize">{member.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RequestSeatsDialog open={requestSeatsOpen} onOpenChange={setRequestSeatsOpen} />
      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}

