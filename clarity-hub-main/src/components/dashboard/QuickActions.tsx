import { Plus, ShoppingCart, UserPlus, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    label: "New Project",
    icon: Plus,
    href: "/projects/new",
    variant: "default" as const,
  },
  {
    label: "Buy Service",
    icon: ShoppingCart,
    href: "/services",
    variant: "outline" as const,
  },
  {
    label: "Invite Team",
    icon: UserPlus,
    href: "/team",
    variant: "outline" as const,
  },
  {
    label: "Raise Ticket",
    icon: LifeBuoy,
    href: "/support",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          onClick={() => navigate(action.href)}
          className="gap-2"
        >
          <action.icon className="h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
