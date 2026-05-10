import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import LeanHome from "@/pages/LeanHome";
import Admin from "@/pages/Admin";
import Order from "@/pages/Order";
import { useUtmCapture } from "@/lib/useUtmCapture";
import { trackPageView } from "@/lib/fb";

const queryClient = new QueryClient();

function HomeOrLean() {
  const isLean =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("lean") === "true";
  return isLean ? <LeanHome /> : <Home />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeOrLean} />
      <Route path="/admin" component={Admin} />
      <Route path="/order" component={Order} />
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
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
