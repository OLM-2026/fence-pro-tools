import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@workspace/api-client-react";
import { ExternalLink, Star } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tool/${tool.slug}`} className="block h-full group">
      <Card className="h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-accent/50 group-hover:border-accent/50 relative overflow-hidden">
        {tool.featured && (
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 flex items-center gap-1 rounded-bl">
            <Star className="w-3 h-3 fill-current" />
            Top Pick
          </div>
        )}
        <CardContent className="p-6 flex-grow flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 border overflow-hidden">
              {tool.logoUrl ? (
                <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-xl text-muted-foreground">{tool.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg group-hover:text-accent transition-colors line-clamp-1">{tool.name}</h3>
              <p className="text-sm text-muted-foreground">{tool.category}</p>
            </div>
          </div>
          <p className="text-sm text-foreground/80 line-clamp-3">
            {tool.description}
          </p>
        </CardContent>
        <CardFooter className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between">
          <Badge variant="secondary" className="bg-background">
            {tool.pricingStartsAt || "Contact for pricing"}
          </Badge>
          <span className="text-accent text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            View Details <ExternalLink className="w-3 h-3" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
