import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { StepperBar } from "@/features/safety-plan/components/StepperBar";
import { InitialDetailsStep } from "@/features/safety-plan/components/InitialDetailsStep";
import { SafetyCheckStep } from "@/features/safety-plan/components/SafetyCheckStep";
import { HazardIDStep } from "@/features/safety-plan/components/HazardIDStep";
import { SignOffStep } from "@/features/safety-plan/components/SignOffStep";
import { PreviewModal } from "@/features/safety-plan/components/PreviewModal";
import { SafetyPlanList } from "@/features/safety-plan/components/SafetyPlanList";
import { Button } from "@/components/ui/button";
import type { SafetyPlanFormData } from "@/features/safety-plan/types";
import { useToast } from "@/hooks/use-toast";
import { SafetyPlanView } from "@/features/safety-plan/components/SafetyPlanView";
import { Eye } from "lucide-react";

type View = "list" | "form" | "view";

const STEP_TITLES = ["", "Task Details", "Safety Questions", "Hazard Identification", "Sign Off"];

const defaultFormData: SafetyPlanFormData = {
  group: "", taskName: "", date: "", location: "", shift: "", machineNumber: "",
  region: "Europe - Ireland", system: "Others", canSocialDistance: "yes",
  q1_specializedTraining: "no", q2_chemicals: "no", q3_impactOthers: "no",
  q4_falls: "no", q5_barricades: "no", q6_loto: "no", q7_lifting: "no",
  q8_ergonomics: "no", q9_otherConcerns: "no", q10_headInjury: "no", q11_otherPPE: "no",
  hazards: [], assessments: {} as Record<string, import("@/features/safety-plan/types").HazardAssessment>,
  leadName: "", approverName: "", engineers: [], comments: "", status: "pending",
};

export default function SafetyPlanPage() {
  const [view, setView] = useState<View>("list");
  const [viewingPlan, setViewingPlan] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<SafetyPlanFormData>(defaultFormData);
  const [showPreview, setShowPreview] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: preferences } = useQuery<{
    isFirstTime: string;
    system: string;
    group: string;
    site: string;
  }>({
    queryKey: ["/api/user-preferences", "default"],
  });

  const { data: existingPlans = [] } = useQuery<any[]>({
    queryKey: ["/api/safety-plans"],
  });

  const { data: permits = [] } = useQuery<any[]>({
    queryKey: ["/api/permits"],
  });

  const knownValues = {
    machines: Array.from(new Set((existingPlans as any[]).map(p => p.machineNumber).filter(Boolean))) as string[],
    locations: Array.from(new Set((existingPlans as any[]).map(p => p.location).filter(Boolean))) as string[],
    shifts: Array.from(new Set(["Day", "Night", "Swing", ...(existingPlans as any[]).map(p => p.shift).filter(Boolean)])) as string[],
  };

  const submitMutation = useMutation({
    mutationFn: (data: SafetyPlanFormData) => apiRequest("POST", "/api/safety-plans", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/safety-plans"] });
      setView("list");
      setStep(1);
      setCompletedSteps([]);
      setFormData(defaultFormData);
      toast({ title: "Safety Plan submitted successfully." });
    },
  });

  const startNewForm = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      ...defaultFormData,
      system: preferences?.system || "Others",
      group: preferences?.group || "Europe",
      region: preferences?.site || "Europe - Ireland",
      date: today,
      canSocialDistance: "yes",
    });
    setStep(1);
    setCompletedSteps([]);
    setView("form");
  };

  const exitForm = () => {
    setView("list");
    setStep(1);
    setCompletedSteps([]);
    setFormData(defaultFormData);
  };

  const handleInitialDetailsSubmit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCompletedSteps([1]);
    setStep(2);
  };

  const advance = () => {
    setCompletedSteps(prev => Array.from(new Set([...prev, step])));
    setStep(prev => Math.min(prev + 1, 4) as any);
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const editPlan = (plan: any) => {
    setFormData({ ...defaultFormData, ...plan });
    setCompletedSteps([1, 2, 3]);
    setStep(1);
    setView("form");
  };

  if (view === "list") {
    return (
      <div className="p-4 sm:p-6">
        <SafetyPlanList onNew={startNewForm} onEdit={(id) => {
          const plan = (existingPlans as any[]).find(p => p.id === id);
          if (plan) { setViewingPlan(plan); setView("view"); }
        }} />
      </div>
    );
  }

  if (view === "view" && viewingPlan) {
    return (
      <div className="p-4 sm:p-6">
        <SafetyPlanView
          plan={viewingPlan}
          onBack={() => { setViewingPlan(null); setView("list"); }}
          onEdit={viewingPlan.status !== "approved" ? () => editPlan(viewingPlan) : undefined}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:min-h-[540px] max-w-6xl mx-auto border border-border rounded-lg overflow-hidden bg-card">
        <StepperBar
          currentStep={step}
          completedSteps={completedSteps}
          onStepClick={setStep}
          prefilled={{ system: formData.system, group: formData.group, region: formData.region, date: formData.date }}
          taskSummary={{ taskName: formData.taskName, shift: formData.shift, location: formData.location, machineNumber: formData.machineNumber }}
          onEditDetails={() => setStep(1)}
          onExit={exitForm}
        />

        <div className="flex-1 flex flex-col">
          <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-border bg-muted/30">
            <h2 className="text-base font-semibold">{STEP_TITLES[step]}</h2>
            <Button type="button" variant="outline" size="sm" onClick={exitForm}>Exit Record</Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-3xl mx-auto">
              {step === 1 && (
                <InitialDetailsStep
                  onSubmit={handleInitialDetailsSubmit}
                  defaultValues={{ system: formData.system, group: formData.group, region: formData.region, date: formData.date, canSocialDistance: formData.canSocialDistance }}
                  knownValues={knownValues}
                />
              )}
              {step === 2 && (
                <SafetyCheckStep values={formData as any} onChange={(key, val) => updateField(key, val)} />
              )}
              {step === 3 && (
                <HazardIDStep
                  hazards={formData.hazards}
                  assessments={formData.assessments}
                  onHazardsChange={(hazards, assessments) => setFormData(prev => ({ ...prev, hazards, assessments }))}
                />
              )}
              {step === 4 && (
                <SignOffStep
                  leadName={formData.leadName}
                  approverName={formData.approverName ?? ""}
                  engineers={formData.engineers}
                  comments={formData.comments ?? ""}
                  linkedPermitId={formData.linkedPermitId}
                  permits={permits as any[]}
                  onChange={updateField}
                />
              )}
              {step > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setStep(s => s - 1 as any)}>&larr; Back</Button>
                  <div className="flex items-center gap-2">
                    {step === 4 && (
                      <>
                        <Button type="button" variant="outline" onClick={() => setShowPreview(true)} className="gap-1.5">
                          <Eye className="h-3.5 w-3.5" /> Preview
                        </Button>
                        <Button type="button" onClick={() => submitMutation.mutate(formData)} disabled={submitMutation.isPending}>
                          {submitMutation.isPending ? "Saving..." : "Complete & Submit"}
                        </Button>
                      </>
                    )}
                    {step < 4 && (
                      <Button type="button" onClick={advance} className="gap-2">
                        Next: {STEP_TITLES[step + 1]} &rarr;
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PreviewModal open={showPreview} onOpenChange={setShowPreview} data={formData} />
    </div>
  );
}
