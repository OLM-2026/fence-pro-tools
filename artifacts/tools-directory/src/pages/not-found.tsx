import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Helmet>
        <title>404 Not Found - Tools for Home Services</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Card className="w-full max-w-md mx-4 shadow-lg border-t-4 border-t-destructive">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">404 Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/">
            <Button className="w-full">Return to Directory</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

