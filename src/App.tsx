import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Catalog from "./pages/Catalog";
import Course from "./pages/Course";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import VerifyCertificate from "./pages/VerifyCertificate";
import PublicPortfolio from "./pages/PublicPortfolio";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suspense } from "react";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/portfolio/:username" element={<PublicPortfolio />} />
                  <Route path="/verify/:code" element={<VerifyCertificate />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/course/:courseId" element={
                    <ProtectedRoute>
                      <Course />
                    </ProtectedRoute>
                  } />
                  <Route path="/quiz/:courseId" element={
                    <ProtectedRoute>
                      <Quiz />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
