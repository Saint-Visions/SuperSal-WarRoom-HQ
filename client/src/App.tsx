import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Splash from "@/pages/splash";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import CommandCenter from "@/pages/command-center"; 
import WarRoom from "@/pages/warroom";
import SupersalExecutive from "@/pages/supersal-executive";
import LeadIntelligence from "@/pages/lead-intelligence";
import SaintSalMe from "@/pages/saintsalme";
import Tools from "@/pages/tools";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import MobileNav from "@/components/ui/mobile-nav";
import StickyCompanion from "@/components/ui/sticky-companion";

function Router() {
  const [location] = useLocation();
  
  // Check if mobile device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
    <>
      <MobileNav currentPath={location} />
      <div className="pb-20 md:pb-0 pt-16 md:pt-0">
        <Switch>
          {/* Root path shows Splash for entrance experience */}
          <Route path="/" component={Splash} />
          <Route path="/login" component={Login} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/command" component={CommandCenter} />
          <Route path="/warroom" component={WarRoom} />
          <Route path="/executive" component={SupersalExecutive} />
          <Route path="/leads" component={LeadIntelligence} />
          <Route path="/saintsalme" component={SaintSalMe} />
          <Route path="/tools" component={Tools} />
          <Route path="/settings" component={Settings} />
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
          <StickyCompanion />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
