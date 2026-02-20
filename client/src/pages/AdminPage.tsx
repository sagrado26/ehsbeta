import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserCog, Upload, FileSpreadsheet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "admin" | "engineer";

export default function AdminPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("admin");

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage user privileges and system configuration</p>
        </div>

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-border p-1 bg-muted/30">
          <button
            type="button"
            onClick={() => setViewMode("admin")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              viewMode === "admin"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            View as Admin
          </button>
          <button
            type="button"
            onClick={() => setViewMode("engineer")}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
              viewMode === "engineer"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            View as Engineer
          </button>
        </div>
      </div>

      {/* Excel Import Placeholder */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="p-2 rounded-md bg-primary/10">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Excel Import</h2>
            <p className="text-xs text-muted-foreground">Upload an Excel file to manage user privileges</p>
          </div>
        </div>
        <div className="p-4">
          <div className="rounded-lg border-2 border-dashed border-border py-8 text-center">
            <Upload className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Drop an Excel file here or click to upload</p>
            <p className="text-[11px] text-muted-foreground/60 mt-1">Supported formats: .xlsx, .xls, .csv</p>
            <Button variant="outline" size="sm" className="mt-3" disabled>
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload File
            </Button>
          </div>
        </div>
      </div>

      {/* User Privilege List */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="p-2 rounded-md bg-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">User Privilege List</h2>
            <p className="text-xs text-muted-foreground">
              {viewMode === "admin"
                ? "Full access — manage all users and roles"
                : "Read-only view — engineer permissions"}
            </p>
          </div>
        </div>

        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Site</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-12">
                  <UserCog className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No users loaded</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">Upload an Excel file to populate the user list</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
