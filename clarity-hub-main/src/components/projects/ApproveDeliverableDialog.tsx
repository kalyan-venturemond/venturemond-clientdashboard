
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ApproveDeliverableDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (notes: string) => void;
    deliverableName: string;
}

export function ApproveDeliverableDialog({
    open,
    onOpenChange,
    onConfirm,
    deliverableName,
}: ApproveDeliverableDialogProps) {
    const [notes, setNotes] = useState("");

    const handleConfirm = () => {
        onConfirm(notes);
        onOpenChange(false);
        setNotes("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Approve Deliverable</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to approve <strong>{deliverableName}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any approval notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="flex-col sm:justify-end gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} className="w-full sm:w-auto bg-success hover:bg-success/90">
                        Confirm Approval
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
