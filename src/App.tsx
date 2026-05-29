import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import VendorServices from "./pages/vendors/VendorServices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Specific Vendor Routes */}
          <Route path="/vendors/services" element={<VendorServices />} />
          
          {/* Generic Admin Routes */}
          <Route path="/dashboard/*" element={<AdminPage />} />
          <Route path="/corporate/*" element={<AdminPage />} />
          <Route path="/inventory/*" element={<AdminPage />} />
          <Route path="/vendors/*" element={<AdminPage />} />
          <Route path="/finance/*" element={<AdminPage />} />
          <Route path="/settings/*" element={<AdminPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;