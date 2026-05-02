import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Hammer, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet>
        <title>About Us - FenceProTools</title>
        <meta name="description" content="Learn about our mission to index the best software for fencing contractors." />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 border-b-8 border-accent">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Built for fencing contractors.</h1>
          <p className="text-xl text-primary-foreground/80 leading-relaxed font-medium">
            Finding the right software to run your fencing business shouldn't require reading through endless SEO blogs. We built this directory to provide a clean, objective index of the tools that actually work for fence installation companies.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 border-2 rounded-sm bg-card shadow-sm">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-sm flex items-center justify-center mx-auto mb-4 border border-accent/20">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Trade Specific</h3>
              <p className="text-sm font-medium text-muted-foreground">We focus entirely on the fencing industry. No generic tools that don't fit your workflow.</p>
            </div>
            
            <div className="text-center p-6 border-2 rounded-sm bg-card shadow-sm">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-sm flex items-center justify-center mx-auto mb-4 border border-accent/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">No Fluff</h3>
              <p className="text-sm font-medium text-muted-foreground">Clear details, straightforward pros and cons, and direct links. No marketing jargon.</p>
            </div>

            <div className="text-center p-6 border-2 rounded-sm bg-card shadow-sm">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-sm flex items-center justify-center mx-auto mb-4 border border-accent/20">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Curated</h3>
              <p className="text-sm font-medium text-muted-foreground">Every submission is reviewed to ensure it provides real value to fencing companies.</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="font-bold border-b pb-2">The Problem</h2>
            <p className="font-medium text-muted-foreground">
              The fencing industry is digitizing. Companies are moving from paper quotes and whiteboards to field service management, digital estimating, and CRM software.
            </p>
            <p className="font-medium text-muted-foreground">
              But searching for "best fencing software" yields page after page of biased affiliate blogs and generic tools that don't handle the specifics of linear footage pricing, gate configurations, or crew dispatching.
            </p>

            <h2 className="font-bold border-b pb-2 mt-12">Our Mission</h2>
            <p className="font-medium text-muted-foreground">
              We act as the definitive trade directory for software in the fencing space. We index and categorize tools so you can make informed decisions about your tech stack without the BS.
            </p>
            <p className="font-medium text-muted-foreground text-sm italic mt-8 border-l-4 border-accent pl-4 py-2">
              Note: We may use affiliate links for some tools in our directory. This helps us keep the site running, but it does not affect our recommendations or how tools are categorized.
            </p>

            <div className="bg-muted p-8 rounded-sm my-10 text-center border-2 border-border">
              <h3 className="mt-0 font-bold">Know a tool we missed?</h3>
              <p className="text-muted-foreground font-medium mb-6">Help us build the most comprehensive directory by submitting tools you use.</p>
              <Link href="/submit">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-sm shadow-sm">Submit a Tool</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}