import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Wrench } from "lucide-react";

export default function About() {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet>
        <title>About Us - Tools for Home Services</title>
        <meta name="description" content="Learn about our mission to index the best software for home service professionals." />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Built for the trades.</h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed">
            Finding the right software to run your home service business shouldn't require reading through endless SEO blogs. We built this directory to provide a clean, objective index of the tools that actually work.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 border rounded-xl bg-card">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Trade Specific</h3>
              <p className="text-sm text-muted-foreground">We categorize tools by the specific trades they serve, not just generic business functions.</p>
            </div>
            
            <div className="text-center p-6 border rounded-xl bg-card">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">No Fluff</h3>
              <p className="text-sm text-muted-foreground">Clear descriptions, straightforward pros and cons, and direct links. No marketing jargon.</p>
            </div>

            <div className="text-center p-6 border rounded-xl bg-card">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Curated</h3>
              <p className="text-sm text-muted-foreground">Every submission is manually reviewed to ensure it provides real value to home service pros.</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>The Problem</h2>
            <p>
              The home services industry is rapidly digitizing. Plumbers, HVAC technicians, landscapers, and general contractors are moving from paper invoices to comprehensive field service management platforms. 
            </p>
            <p>
              But searching for "best plumbing software" yields page after page of biased affiliate blogs, SaaS marketing sites, and generic business tools that don't understand the complexities of dispatch, routing, and field estimating.
            </p>

            <h2>Our Mission</h2>
            <p>
              We act as the definitive trade publication for software in the home services space. We index, categorize, and summarize the capabilities of CRMs, estimating tools, scheduling apps, and payment processors so you can make informed decisions about your tech stack.
            </p>

            <div className="bg-muted p-8 rounded-xl my-10 text-center">
              <h3 className="mt-0 font-bold">Know a tool we missed?</h3>
              <p className="text-muted-foreground mb-6">Help us build the most comprehensive directory by submitting tools you use and love.</p>
              <Link href="/submit">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">Submit a Tool</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
