import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  FileText,
  CheckCircle2,
  Video,
  DollarSign,
  MoreHorizontal,
  Plus,
  GripVertical,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ApproveDeliverableDialog } from "@/components/projects/ApproveDeliverableDialog";
import { RejectDeliverableDialog } from "@/components/projects/RejectDeliverableDialog";
import { useToast } from "@/hooks/use-toast";

const initialProject = {
  id: "proj-1",
  name: "Project Alpha",
  description:
    "E-commerce platform MVP development with modern tech stack including React, Node.js, and PostgreSQL.",
  status: "in-progress",
  progress: 65,
  dueDate: "Mar 15, 2024",
  startDate: "Jan 1, 2024",
  budget: { spent: 9750, total: 15000 },
  hours: { logged: 195, estimated: 300 },
};

const milestones = [
  { id: 1, name: "Discovery & Planning", status: "completed", dueDate: "Jan 15" },
  { id: 2, name: "Design Phase", status: "completed", dueDate: "Jan 31" },
  { id: 3, name: "Development Sprint 1", status: "in-progress", dueDate: "Feb 15" },
  { id: 4, name: "Development Sprint 2", status: "upcoming", dueDate: "Mar 1" },
  { id: 5, name: "Testing & QA", status: "upcoming", dueDate: "Mar 10" },
  { id: 6, name: "Launch", status: "upcoming", dueDate: "Mar 15" },
];

const tasks = {
  todo: [
    { id: 1, title: "Implement payment gateway", priority: "high", assignee: "JD" },
    { id: 2, title: "Add product filtering", priority: "medium", assignee: "SK" },
  ],
  "in-progress": [
    { id: 3, title: "Build cart functionality", priority: "high", assignee: "JD" },
    { id: 4, title: "Design checkout flow", priority: "medium", assignee: "AM" },
  ],
  done: [
    { id: 5, title: "Setup project structure", priority: "low", assignee: "JD" },
    { id: 6, title: "Create design system", priority: "high", assignee: "AM" },
  ],
};

const initialDeliverables = [
  {
    id: 1,
    name: "UI/UX Design Files",
    status: "approved",
    uploadedAt: "Jan 25, 2024",
  },
  {
    id: 2,
    name: "API Documentation",
    status: "pending",
    uploadedAt: "Feb 5, 2024",
  },
  {
    id: 3,
    name: "Sprint 1 Demo",
    status: "pending",
    uploadedAt: "Feb 10, 2024",
  },
];

const meetings = [
  {
    id: 1,
    title: "Sprint Review",
    date: "Tomorrow",
    time: "3:00 PM",
    attendees: 4,
  },
  {
    id: 2,
    title: "Design Review",
    date: "Jan 20",
    time: "2:00 PM",
    attendees: 3,
  },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const [project] = useState(initialProject);
  const [deliverables, setDeliverables] = useState(initialDeliverables);
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 1, title: "Project Created", date: "Jan 1, 2024", description: "Project initiated by client" },
    { id: 2, title: "Design Phase Completed", date: "Jan 31, 2024", description: "All design milestones approved" },
  ]);

  // Dialog States
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<typeof initialDeliverables[0] | null>(null);

  const priorityColors = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-warning/10 text-warning",
    low: "bg-muted text-muted-foreground",
  };

  const handleApproveClick = (deliverable: typeof initialDeliverables[0]) => {
    setSelectedDeliverable(deliverable);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (deliverable: typeof initialDeliverables[0]) => {
    setSelectedDeliverable(deliverable);
    setRejectDialogOpen(true);
  };

  const confirmApprove = (notes: string) => {
    if (!selectedDeliverable) return;

    // Update Deliverable Status
    setDeliverables(prev => prev.map(d =>
      d.id === selectedDeliverable.id ? { ...d, status: "approved" } : d
    ));

    // Show Toast
    toast({
      title: "Deliverable Approved",
      description: `Successfully approved ${selectedDeliverable.name}.`,
      variant: "default",
      className: "bg-success text-white border-none"
    });

    // Add Timeline Event
    const newEvent = {
      id: Date.now(),
      title: "Deliverable Approved",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Client approved ${selectedDeliverable.name}${notes ? `: ${notes}` : ''}`
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    setApproveDialogOpen(false);
  };

  const confirmReject = (reason: string, file: File | null) => {
    if (!selectedDeliverable) return;

    // Update Deliverable Status
    setDeliverables(prev => prev.map(d =>
      d.id === selectedDeliverable.id ? { ...d, status: "rejected" } : d
    ));

    // Show Toast
    toast({
      title: "Deliverable Rejected",
      description: `Feedback sent for ${selectedDeliverable.name}.`,
      variant: "destructive"
    });

    // Add Timeline Event
    const newEvent = {
      id: Date.now(),
      title: "Deliverable Rejected",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Client rejected ${selectedDeliverable.name}. Reason: ${reason}`
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    setRejectDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dialogs */}
      {selectedDeliverable && (
        <>
          <ApproveDeliverableDialog
            open={approveDialogOpen}
            onOpenChange={setApproveDialogOpen}
            onConfirm={confirmApprove}
            deliverableName={selectedDeliverable.name}
          />
          <RejectDeliverableDialog
            open={rejectDialogOpen}
            onOpenChange={setRejectDialogOpen}
            onConfirm={confirmReject}
            deliverableName={selectedDeliverable.name}
          />
        </>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/projects"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{project.description}</p>
        </div>
        <Badge className="bg-info/10 text-info">In Progress</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Timeline</p>
              <p className="font-medium">
                {project.startDate} - {project.dueDate}
              </p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="font-medium">{project.progress}% Complete</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-medium">
                ${project.budget.spent.toLocaleString()} / ${project.budget.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10 text-info">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hours</p>
              <p className="font-medium">
                {project.hours.logged}h / {project.hours.estimated}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Progress Overview */}
            <div className="dashboard-card">
              <h3 className="section-title mb-4">Project Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Budget Used</span>
                    <span>{Math.round((project.budget.spent / project.budget.total) * 100)}%</span>
                  </div>
                  <Progress
                    value={(project.budget.spent / project.budget.total) * 100}
                    className="h-3"
                  />
                </div>
              </div>
            </div>

            {/* Next Meeting */}
            <div className="space-y-6">
              <div className="dashboard-card">
                <h3 className="section-title mb-4">Upcoming Meeting</h3>
                {meetings[0] && (
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-info/10 text-info">
                        <Video className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{meetings[0].title}</p>
                        <p className="text-sm text-muted-foreground">
                          {meetings[0].date} at {meetings[0].time}
                        </p>
                      </div>
                    </div>
                    <Button size="sm">Join Call</Button>
                  </div>
                )}
              </div>

              {/* Timeline Feed */}
              <div className="dashboard-card">
                <h3 className="section-title mb-4">Recent Activity</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {timelineEvents.map((event) => (
                    <div key={event.id} className="flex gap-3 items-start">
                      <div className="mt-1 p-1.5 rounded-full bg-secondary text-secondary-foreground">
                        <Activity className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground mb-1">{event.date}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="milestones">
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Milestones</h3>

            </div>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        milestone.status === "completed" && "bg-success",
                        milestone.status === "in-progress" && "bg-info",
                        milestone.status === "upcoming" && "bg-muted-foreground"
                      )}
                    />
                    <span className="font-medium">{milestone.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{milestone.dueDate}</span>
                    <Badge
                      className={cn(
                        milestone.status === "completed" && "bg-success/10 text-success",
                        milestone.status === "in-progress" && "bg-info/10 text-info",
                        milestone.status === "upcoming" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(tasks).map(([column, columnTasks]) => (
              <div key={column} className="dashboard-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold capitalize">{column.replace("-", " ")}</h3>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </div>
                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-secondary/30 rounded-lg cursor-move hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              className={cn(
                                "text-xs",
                                priorityColors[task.priority as keyof typeof priorityColors]
                              )}
                            >
                              {task.priority}
                            </Badge>
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">{task.assignee}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliverables">
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Deliverables</h3>

            </div>
            <div className="space-y-3">
              {deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{deliverable.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {deliverable.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        deliverable.status === "approved"
                          ? "bg-success/10 text-success"
                          : deliverable.status === "rejected"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/10 text-warning"
                      )}
                    >
                      {deliverable.status}
                    </Badge>
                    {deliverable.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleRejectClick(deliverable)}>
                          Reject
                        </Button>
                        <Button size="sm" variant="success" onClick={() => handleApproveClick(deliverable)}>
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meetings">
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Meetings</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Schedule
              </Button>
            </div>
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-info/10 text-info">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{meeting.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {meeting.date} at {meeting.time} • {meeting.attendees} attendees
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Join</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="budget">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="dashboard-card">
              <h3 className="section-title mb-4">Budget Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-medium">${project.budget.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-medium">${project.budget.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium text-success">
                    ${(project.budget.total - project.budget.spent).toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={(project.budget.spent / project.budget.total) * 100}
                  className="h-3"
                />
              </div>
            </div>
            <div className="dashboard-card">
              <h3 className="section-title mb-4">Time Log</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Hours</span>
                  <span className="font-medium">{project.hours.estimated}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Logged</span>
                  <span className="font-medium">{project.hours.logged}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium text-success">
                    {project.hours.estimated - project.hours.logged}h
                  </span>
                </div>
                <Progress
                  value={(project.hours.logged / project.hours.estimated) * 100}
                  className="h-3"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

