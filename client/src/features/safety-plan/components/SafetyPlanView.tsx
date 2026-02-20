import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NameAvatar } from "@/components/ui/name-avatar";
import { cn } from "@/lib/utils";
import { ArrowLeft, AlertTriangle, ShieldCheck, ShieldAlert, Users, History, ClipboardCheck, FileText, GraduationCap, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHazardInfo } from "../hazard-data";
import type { SafetyPlanFormData } from "../types";

const QUESTION_LABELS: Record<string, string> = {
  q1_specializedTraining: "Specialized Training",
  q2_chemicals: "Chemicals / Hazardous Materials",
  q3_impactOthers: "Other Work in Area",
  q4_falls: "Fall Hazard",
  q5_barricades: "Barricades Required",
  q6_loto: "LOTO Required",
  q7_lifting: "Heavy Lifting",
  q8_ergonomics: "Ergonomic Concerns",
  q9_otherConcerns: "Other Safety Concerns",
  q10_headInjury: "Head Injury Risk",
  q11_otherPPE: "Additional PPE",
};

function getRiskColor(score: number) {
  if (score >= 12) return { bg: "bg-red-500", text: "text-white", label: "Extreme", border: "border-red-200 dark:border-red-500/20" };
  if (score >= 8) return { bg: "bg-orange-500", text: "text-white", label: "High", border: "border-orange-200 dark:border-orange-500/20" };
  if (score >= 4) return { bg: "bg-amber-400", text: "text-amber-900", label: "Medium", border: "border-amber-200 dark:border-amber-500/20" };
  return { bg: "bg-primary", text: "text-primary-foreground", label: "Low", border: "border-primary/20" };
}

interface Props {
  plan: SafetyPlanFormData & { id?: number };
  onBack: () => void;
  onEdit?: () => void;
}

function formatTimestamp(ts: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function SafetyPlanView({ plan, onBack, onEdit }: Props) {
  const flagged = Object.entries(QUESTION_LABELS).filter(([key]) => (plan as any)[key] === "yes");
  const cleared = Object.entries(QUESTION_LABELS).filter(([key]) => (plan as any)[key] === "no");

  const checklistHazards = plan.hazards.filter(name => plan.assessments[name]?.requiresChecklist);
  const ptwHazards = plan.hazards.filter(name => plan.assessments[name]?.requiresPtW);

  const { data: auditLogs = [] } = useQuery<any[]>({
    queryKey: ["/api/audit-logs", { safetyPlanId: plan.id }],
    queryFn: () => fetch(`/api/audit-logs?safetyPlanId=${plan.id}`).then(r => r.json()),
    enabled: !!plan.id,
  });

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Button type="button" variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {plan.id && (
              <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                ISP-{String(plan.id).padStart(4, "0")}
              </Badge>
            )}
            <h1 className="text-lg font-semibold truncate">{plan.taskName}</h1>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant={plan.status === "approved" ? "default" : "secondary"} className="text-[10px]">
              {plan.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{plan.date}</span>
          </div>
        </div>
        {onEdit && (
          <Button type="button" variant="outline" size="sm" onClick={onEdit} className="shrink-0 gap-1.5">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
      </div>

      {/* Compact task details */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2.5 mb-5">
        <span><strong className="text-foreground">Shift:</strong> {plan.shift}</span>
        <span><strong className="text-foreground">Location:</strong> {plan.location}</span>
        <span><strong className="text-foreground">Machine:</strong> {plan.machineNumber}</span>
        <span><strong className="text-foreground">Group:</strong> {plan.group}</span>
        <span><strong className="text-foreground">System:</strong> {plan.system}</span>
      </div>

      {/* ===== SAFETY REVIEW ===== */}
      {flagged.length > 0 ? (
        <Card className="p-4 mb-4 border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
              {flagged.length} Safety Concern{flagged.length !== 1 ? "s" : ""} Flagged
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {flagged.map(([, label]) => (
              <span key={label} className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-500/20">
                {label}
              </span>
            ))}
          </div>
          {cleared.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-amber-200/50 dark:border-amber-500/10">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <p className="text-[11px] text-muted-foreground">{cleared.length} item{cleared.length !== 1 ? "s" : ""} cleared</p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-4 mb-4 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold text-primary">All Safety Checks Cleared</p>
          </div>
        </Card>
      )}

      {/* ===== HAZARDS ===== */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Hazards ({plan.hazards.length})</p>
        </div>

        {plan.hazards.length === 0 ? (
          <p className="text-sm text-muted-foreground px-1">No hazards identified.</p>
        ) : (
          <div className="space-y-3">
            {plan.hazards.map(name => {
              const a = plan.assessments[name];
              const score = a ? a.severity * a.likelihood : 0;
              const risk = getRiskColor(score);
              const info = getHazardInfo(name);

              return (
                <Card key={name} className={cn("p-4", risk.border)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={cn("h-7 min-w-[28px] px-1.5 flex items-center justify-center rounded-md text-[11px] font-bold", risk.bg, risk.text)}>
                        {score}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{name}</p>
                        {info && (
                          <p className="text-[11px] text-muted-foreground/60">e.g. {info.example}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded", risk.bg, risk.text)}>
                        {risk.label}
                      </span>
                      {a && (
                        <span className="text-[10px] text-muted-foreground">S:{a.severity} × L:{a.likelihood}</span>
                      )}
                    </div>
                  </div>

                  {/* Requirement badges */}
                  {(a?.requiresChecklist || a?.requiresPtW || info?.training) && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {a?.requiresChecklist && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-medium border border-blue-500/20">
                          <ClipboardCheck className="h-3 w-3" /> {a.checklistType || "Checklist Required"}
                        </span>
                      )}
                      {a?.requiresPtW && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[10px] font-medium border border-amber-500/20">
                          <FileText className="h-3 w-3" /> {a.permitType || "PtW Required"}
                        </span>
                      )}
                      {info?.training && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium">
                          <GraduationCap className="h-3 w-3" /> {info.training}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Mitigation */}
                  {a?.mitigation ? (
                    <div className="rounded-md bg-primary/5 border border-primary/10 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Mitigation Plan</p>
                      <p className="text-sm text-foreground leading-relaxed">{a.mitigation}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-destructive/70 italic">No mitigation plan provided</p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Required documents summary */}
      {(checklistHazards.length > 0 || ptwHazards.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {checklistHazards.length > 0 && (
            <Card className="p-3 border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-semibold text-blue-800 dark:text-blue-400">Required Checklists</p>
              </div>
              <div className="space-y-1">
                {checklistHazards.map(name => (
                  <p key={name} className="text-[11px] text-blue-700 dark:text-blue-400/80">
                    {plan.assessments[name]?.checklistType} — {name}
                  </p>
                ))}
              </div>
            </Card>
          )}
          {ptwHazards.length > 0 && (
            <Card className="p-3 border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-amber-600" />
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">Linked Permit to Work</p>
              </div>
              <div className="space-y-1">
                {ptwHazards.map(name => (
                  <p key={name} className="text-[11px] text-amber-700 dark:text-amber-400/80">
                    {plan.assessments[name]?.permitType} — {name}
                  </p>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Sign-off */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-semibold">Sign Off</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2.5">
            <NameAvatar name={plan.leadName} />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lead</p>
              <p className="text-sm font-medium">{plan.leadName || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <NameAvatar name={plan.approverName || ""} />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Manager</p>
              <p className="text-sm font-medium">{plan.approverName || "—"}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Team</p>
            {plan.engineers.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1.5">
                  {plan.engineers.slice(0, 4).map(name => (
                    <NameAvatar key={name} name={name} className="h-6 w-6 text-[9px] ring-2 ring-background" />
                  ))}
                </div>
                {plan.engineers.length > 4 && (
                  <span className="text-[10px] text-muted-foreground">+{plan.engineers.length - 4}</span>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </div>
        </div>
        {plan.comments && (
          <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border italic">"{plan.comments}"</p>
        )}
      </Card>

      {/* Version History */}
      {plan.id && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <History className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold">Version History</p>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              v{Math.max(1, (auditLogs as any[]).filter(l => l.action === "edited").length + 1)}.0
            </Badge>
          </div>

          {(auditLogs as any[]).length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit trail available.</p>
          ) : (
            <div className="relative pl-5 space-y-3">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
              {(auditLogs as any[]).map((log: any, idx: number) => {
                const isLatest = idx === 0;
                const actionColors: Record<string, string> = {
                  created: "bg-primary",
                  edited: "bg-amber-500",
                  approved: "bg-blue-500",
                  rejected: "bg-red-500",
                };
                return (
                  <div key={log.id} className="relative">
                    <div className={cn(
                      "absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                      actionColors[log.action] || "bg-muted-foreground"
                    )} />
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize">{log.action}</span>
                          {isLatest && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Latest</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          by {log.performedBy}
                          {log.previousStatus && log.newStatus && log.previousStatus !== log.newStatus && (
                            <span> &middot; {log.previousStatus} &rarr; {log.newStatus}</span>
                          )}
                        </p>
                        {log.comments && (
                          <p className="text-xs text-muted-foreground mt-1 italic">"{log.comments}"</p>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {formatTimestamp(log.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
