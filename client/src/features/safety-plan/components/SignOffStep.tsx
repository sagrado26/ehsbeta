import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Plus, X, PenLine, FileText } from "lucide-react";

interface Permit {
  id: number;
  workType: string;
  location: string;
  date: string;
  status: string;
  submitter: string;
}

interface Props {
  leadName: string;
  approverName: string;
  engineers: string[];
  comments: string;
  linkedPermitId?: number;
  permits?: Permit[];
  onChange: (field: string, value: any) => void;
}

export function SignOffStep({ leadName, approverName, engineers, comments, linkedPermitId, permits = [], onChange }: Props) {
  const [memberInput, setMemberInput] = useState("");

  const addMember = () => {
    if (!memberInput.trim()) return;
    onChange("engineers", [...engineers, memberInput.trim()]);
    setMemberInput("");
  };

  const submittedPermits = permits.filter(p => p.status === "approved" || p.status === "pending");
  const linkedPermit = permits.find(p => p.id === linkedPermitId);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10">
          <PenLine className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">Sign Off</h2>
          <p className="text-sm text-muted-foreground">Names and final comment</p>
        </div>
      </div>

      {/* Lead + Manager side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">
            Lead Name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={leadName}
            onChange={e => onChange("leadName", e.target.value)}
            placeholder="Lead assessor name"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Manager Name</Label>
          <Input
            value={approverName}
            onChange={e => onChange("approverName", e.target.value)}
            placeholder="Approving manager"
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Team members */}
      <div>
        <Label className="text-sm font-medium">Team Members</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            value={memberInput}
            onChange={e => setMemberInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addMember())}
            placeholder="Add name and press Enter"
          />
          <Button type="button" variant="outline" size="icon" onClick={addMember} className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {engineers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {engineers.map(name => (
              <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-sm text-foreground/80">
                {name}
                <button type="button" onClick={() => onChange("engineers", engineers.filter(e => e !== name))} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comment */}
      <div>
        <Label className="text-sm font-medium">Comment</Label>
        <Input
          value={comments}
          onChange={e => onChange("comments", e.target.value)}
          placeholder="Any additional notes..."
          className="mt-1.5"
        />
      </div>

      {/* Permit link — subtle, collapsed by default feel */}
      {submittedPermits.length > 0 && (
        <div className="pt-3 border-t border-border">
          <Label className="text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              Link Permit to Work (optional)
            </span>
          </Label>
          <Select
            value={linkedPermitId ? String(linkedPermitId) : "none"}
            onValueChange={(v) => onChange("linkedPermitId", v === "none" ? undefined : Number(v))}
          >
            <SelectTrigger className="mt-1.5 h-9 text-sm">
              <SelectValue placeholder="No linked permit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No linked permit</SelectItem>
              {submittedPermits.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>
                  PTW-{String(p.id).padStart(4, "0")} — {p.workType} ({p.location})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {linkedPermit && (
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {linkedPermit.location} &middot; {linkedPermit.date} &middot; {linkedPermit.submitter}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
