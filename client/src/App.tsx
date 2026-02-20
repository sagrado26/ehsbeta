import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { AppShell } from "@/components/layout/AppShell";
import NotFound from "@/pages/not-found";

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const SafetyPlanPage = lazy(() => import("@/pages/SafetyPlanPage"));
const PermitToWorkPage = lazy(() => import("@/pages/PermitToWorkPage"));
const CraneInspectionPage = lazy(() => import("@/pages/CraneInspectionPage"));
const DraegerCalibrationPage = lazy(() => import("@/pages/DraegerCalibrationPage"));
const IncidentsPage = lazy(() => import("@/pages/IncidentsPage"));
const DocumentationPage = lazy(() => import("@/pages/DocumentationPage"));
const Settings = lazy(() => import("@/pages/settings"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/safety-plan" component={SafetyPlanPage} />
        <Route path="/permit-to-work" component={PermitToWorkPage} />
        <Route path="/crane-inspection" component={CraneInspectionPage} />
        <Route path="/draeger-calibration" component={DraegerCalibrationPage} />
        <Route path="/incidents" component={IncidentsPage} />
        <Route path="/documentation" component={DocumentationPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AppShell>
            <Toaster />
            <Router />
          </AppShell>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
