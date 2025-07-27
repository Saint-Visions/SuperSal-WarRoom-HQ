import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login";
import CommandCenter from "@/pages/command-center"; 
import WarRoom from "@/pages/warroom";
import SupersalExecutive from "@/pages/supersal-executive";
import NotFound from "@/pages/not-found";
import MobileNav from "@/components/ui/mobile-nav";

function Router() {
  const [location] = useLocation();
  
  return (
    <>
      <MobileNav currentPath={location} />
      <div className="pb-20 md:pb-0 pt-16 md:pt-0">
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/command" component={CommandCenter} />
          <Route path="/warroom" component={WarRoom} />
          <Route path="/executive" component={SupersalExecutive} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
