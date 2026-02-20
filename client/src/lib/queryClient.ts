import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { staticData } from "./staticData";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Check if we're in static mode (GitHub Pages)
    const isStatic = window.location.hostname.includes('github.io');

    if (isStatic) {
      // Return static data for GitHub Pages
      const path = queryKey.join('/') as string;
      if (path === '/api/safety-plans') return staticData.safetyPlans as T;
      if (path === '/api/permits') return staticData.permits as T;
      if (path === '/api/crane-inspections') return staticData.craneInspections as T;
      if (path === '/api/draeger-calibrations') return staticData.draegerCalibrations as T;
      if (path === '/api/incidents') return staticData.incidents as T;
      if (path === '/api/documents') return staticData.documents as T;
      return [] as T;
    }

    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
