import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound"; 
import Contact from "./pages/Contact";
import TormsConditions from "./pages/TormsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import ScrollToTop from "./components/ScrollToTop";
import Faq from "./pages/Faq"
import SizeGuide from "./pages/SizeGuide";
import ReturnsExchanges from "./pages/ReturnExchange";
import Wishlist from "./pages/Wishlist";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/search" element={<Search />} />
          
          {/* CUSTOM PRIVACY & POLICY PAGE */}
          <Route path="/contact" element={<Contact/>} />
          <Route path="/privacy" element={<PrivacyPolicy/>} />
          <Route path="/terms-and-conditions" element={<TormsConditions/>} />
          <Route path="/cookie-policy" element={<CookiePolicy/>} />
          <Route path="/faq" element={<Faq/>} />
          <Route path="/sizeguide" element={<SizeGuide/>} />
          <Route path="/returns" element={<ReturnsExchanges/>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
