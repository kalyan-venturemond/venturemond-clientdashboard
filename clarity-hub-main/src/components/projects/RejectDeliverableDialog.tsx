
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
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RejectDeliverableDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string, file: File | null) => void;
    deliverableName: string;
}

export function RejectDeliverableDialog({
    open,
    onOpenChange,
    onConfirm,
    deliverableName,
}: RejectDeliverableDialogProps) {
    const [reason, setReason] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleConfirm = () => {
        if (!reason.trim()) return;
        onConfirm(reason, file);
        onOpenChange(false);
        setReason("");
        setFile(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reject Deliverable</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejecting <strong>{deliverableName}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for rejection <span className="text-destructive">*</span></Label>
                        <Textarea
                            id="reason"
                            placeholder="Explain what needs verification or changes..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className={!reason.trim() ? "border-destructive/50" : ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file">Attachment (Optional)</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        />
                    </div>
                </div>
                <DialogFooter className="flex-col sm:justify-end gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                        variant="destructive"
                        className="w-full sm:w-auto"
                    >
                        Submit Rejection
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
