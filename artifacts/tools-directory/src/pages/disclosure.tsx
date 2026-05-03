import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Disclosure() {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <Helmet>
        <title>Affiliate Disclosure - FenceProTools</title>
        <meta
          name="description"
          content="FenceProTools affiliate disclosure — how we earn commissions, how that affects our recommendations, and how to contact us with questions."
        />
      </Helmet>

      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Affiliate Disclosure</h1>
        <p className="text-muted-foreground text-sm font-medium mb-10">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-bold mb-3">Why we use affiliate links</h2>
            <p className="text-muted-foreground leading-relaxed">
              FenceProTools is a free, independently run directory. We don't charge contractors to list a tool, and we don't charge you to access the site. To cover the costs of research, writing, hosting, and keeping everything updated, we use affiliate partnerships with some of the software companies we cover.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              When you click a link to a tool on FenceProTools and sign up for a paid plan, we may receive a commission from that company. This is how many independent review and directory sites operate, including the trade publications and comparison sites you've used before.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">How affiliate links work</h2>
            <p className="text-muted-foreground leading-relaxed">
              Affiliate commissions come from the software vendor, not from you. The price you pay for any tool is exactly the same whether you click through FenceProTools or go directly to the vendor's website. In some cases, affiliate links may even unlock a discount or extended trial that you wouldn't get by going direct.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We mark affiliate links as external links. Pages that contain affiliate links also display a notice at the top of the page so you know before you read.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">How this affects our recommendations</h2>
            <p className="text-muted-foreground leading-relaxed">
              It doesn't. Our editorial process is independent of our commercial relationships. Tools are evaluated based on their usefulness to fencing contractors: features, pricing, mobile app quality, integrations, and real-world fit for fence installation businesses. A tool that pays us a commission doesn't get a better rating because of it, and a tool that doesn't have an affiliate program doesn't get excluded.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We include tools on FenceProTools because we believe they're worth knowing about. If we wouldn't suggest a tool to a friend running a fence crew, it doesn't go in the directory.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">FTC compliance</h2>
            <p className="text-muted-foreground leading-relaxed">
              This disclosure is provided in accordance with the Federal Trade Commission's guidelines on endorsements and testimonials (16 CFR Part 255). The FTC requires that material connections between a reviewer and a product be clearly disclosed. Affiliate commissions are a material connection, and we disclose them site-wide and on relevant pages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Questions</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about how we earn revenue, how a specific tool was evaluated, or whether a link on a particular page is an affiliate link, reach out at{" "}
              <a
                href="mailto:hello@fenceprotools.com"
                className="underline hover:text-foreground transition-colors"
              >
                hello@fenceprotools.com
              </a>
              . We'll respond within 2 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
