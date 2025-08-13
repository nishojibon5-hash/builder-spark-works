import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Apply from "./pages/Apply";
import Calculator from "./pages/Calculator";
import Loans from "./pages/Loans";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SocietyManager from "./pages/SocietyManager";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMembers from "./pages/admin/Members";
import UserProfileDashboard from "./pages/admin/UserProfile";
import ApplicationReview from "./pages/admin/ApplicationReview";
import AdminLoans from "./pages/admin/Loans";
import AdminRepayments from "./pages/admin/Repayments";
import AdminKYC from "./pages/admin/KYC";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/user-profiles" element={<UserProfileDashboard />} />
          <Route path="/admin/application-review" element={<ApplicationReview />} />
          <Route path="/admin/loans" element={<AdminLoans />} />
          <Route path="/admin/repayments" element={<AdminRepayments />} />
          <Route path="/admin/kyc" element={<AdminKYC />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
