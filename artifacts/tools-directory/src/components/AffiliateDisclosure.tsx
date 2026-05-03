import { Link } from "wouter";

interface AffiliateDisclosureProps {
  variant?: "footer" | "page-top";
}

export default function AffiliateDisclosure({ variant = "footer" }: AffiliateDisclosureProps) {
  if (variant === "footer") {
    return (
      <div className="border-t border-gray-200 py-6 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-sm text-gray-600 text-center">
          <p>
            <strong>Affiliate Disclosure:</strong> FenceProTools may earn affiliate commissions when you purchase through links on this site, at no additional cost to you. This helps us keep the directory free and continue researching the best tools for fencing contractors. We only recommend products we'd suggest to a friend in the business.{" "}
            <Link href="/disclosure" className="underline hover:text-gray-900 transition-colors">
              Full disclosure
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  if (variant === "page-top") {
    return (
      <p className="text-xs text-muted-foreground/50 mb-4 font-medium">
        Some links are affiliate links.{" "}
        <Link href="/disclosure" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
          Learn more
        </Link>
        .
      </p>
    );
  }

  return null;
}
