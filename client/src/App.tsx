// Replit Auth integration - reference: blueprint javascript_log_in_with_replit
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Atelier from "@/pages/Atelier";
import MyDesigns from "@/pages/MyDesigns";
import Marketplace from "@/pages/Marketplace";
import MyShop from "@/pages/MyShop";
import MyOrders from "@/pages/MyOrders";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/atelier/:productId" component={Atelier} />
          <Route path="/designs" component={MyDesigns} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/shop" component={MyShop} />
          <Route path="/orders" component={MyOrders} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
