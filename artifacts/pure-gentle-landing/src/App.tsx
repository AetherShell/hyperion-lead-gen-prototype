import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Customize from "@/pages/Customize";
import V3 from "@/pages/V3";
import { useUtmCapture } from "@/lib/useUtmCapture";
import { trackPageView } from "@/lib/fb";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/customize" component={Customize} />
      <Route path="/v3" component={V3} />
      <Route path="/v3/" component={V3} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useUtmCapture();
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={["/", "./"].includes(import.meta.env.BASE_URL) ? "" : import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
