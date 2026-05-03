import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import Home from "@/pages/home";
import Category from "@/pages/category";
import Tool from "@/pages/tool";
import CompareTools from "@/pages/compare";
import CompareIndex from "@/pages/compare-index";
import Submit from "@/pages/submit";
import BlogList from "@/pages/blog";
import BlogPostDetail from "@/pages/blog-detail";
import About from "@/pages/about";
import Disclosure from "@/pages/disclosure";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground font-sans">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Switch>
          <Route path="/" component={Home} />

          {/* SEO-friendly category URLs */}
          <Route path="/fence-estimating-software" component={Category} />
          <Route path="/fence-crm-software" component={Category} />
          <Route path="/fence-field-service-software" component={Category} />
          <Route path="/fence-invoicing-software" component={Category} />
          <Route path="/fence-scheduling-software" component={Category} />
          <Route path="/fence-project-management-software" component={Category} />
          <Route path="/fence-marketing-software" component={Category} />
          <Route path="/fence-accounting-software" component={Category} />
          <Route path="/fence-branded-materials" component={Category} />

          {/* Legacy category routes (still supported) */}
          <Route path="/category/:slug" component={Category} />

          <Route path="/tool/:slug" component={Tool} />
          <Route path="/compare" component={CompareIndex} />
          <Route path="/compare/:slug1/:slug2" component={CompareTools} />
          <Route path="/compare/:slug1/:slug2/:slug3" component={CompareTools} />
          <Route path="/submit" component={Submit} />
          <Route path="/blog" component={BlogList} />
          <Route path="/blog/:slug" component={BlogPostDetail} />
          <Route path="/about" component={About} />
          <Route path="/disclosure" component={Disclosure} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
