import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { AppShell } from "@/components/layout/AppShell";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/DashboardPage";
import SafetyPlanPage from "@/pages/SafetyPlanPage";
import PermitToWorkPage from "@/pages/PermitToWorkPage";
import CraneInspectionPage from "@/pages/CraneInspectionPage";
import DraegerCalibrationPage from "@/pages/DraegerCalibrationPage";
import IncidentsPage from "@/pages/IncidentsPage";
import DocumentationPage from "@/pages/DocumentationPage";
import Settings from "@/pages/settings";
import AdminPage from "@/pages/AdminPage";

function Router() {
  return (
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
