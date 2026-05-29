import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/*" element={<AdminPage />} />
          
          {/* Corporate Routes */}
          <Route path="/corporate/*" element={<AdminPage />} />
          
          {/* Inventory Routes */}
          <Route path="/inventory/*" element={<AdminPage />} />
          
          {/* Vendor Routes */}
          <Route path="/vendors/*" element={<AdminPage />} />
          
          {/* Finance Routes */}
          <Route path="/finance/*" element={<AdminPage />} />
          
          {/* Settings Routes */}
          <Route path="/settings/*" element={<AdminPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;