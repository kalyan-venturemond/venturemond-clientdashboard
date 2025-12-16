import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertTriangle } from "lucide-react";

interface CancelSubscriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCancel: (reason: string) => Promise<void>;
}

const REASONS = [
    "Too expensive",
    "Missing features",
    "Switching to another provider",
    "Project completed",
    "Other"
];

export function CancelSubscriptionDialog({
    open,
    onOpenChange,
    onCancel
}: CancelSubscriptionDialogProps) {
    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        setLoading(true);
        await onCancel(`${reason}: ${comment}`);
        setLoading(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Cancel Subscription
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure? This will remove access to premium features at the end of your billing cycle.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                        <Label>Why are you cancelling?</Label>
                        <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                            {REASONS.map((r) => (
                                <div key={r} className="flex items-center space-x-2">
                                    <RadioGroupItem value={r} id={r} />
                                    <Label htmlFor={r} className="font-normal cursor-pointer">{r}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Additional Feedback (Optional)</Label>
                        <Textarea
                            placeholder="Tell us more about your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Keep Subscription</Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={!reason || loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Cancellation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
