import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BookOpen } from "lucide-react";

export default function BlogList() {
  const { data: posts, isLoading } = useListBlogPosts();

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in fade-in duration-300">
      <Helmet>
        <title>Resources & Guides - FenceProTools</title>
        <meta name="description" content="Guides, articles, and resources for running a better fencing business." />
      </Helmet>

      <div className="bg-primary text-primary-foreground py-16 border-b-8 border-accent">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-4 text-accent">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-4xl font-bold tracking-tight text-white">Resources</h1>
          </div>
          <p className="text-xl text-primary-foreground/80 max-w-2xl font-medium">
            Guides, insights, and software roundups to help you scale your fencing company.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-sm" />
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 border-2 rounded-sm">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No resources found</h3>
            <p className="text-muted-foreground font-medium">Check back soon for new articles and guides.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
                <Card className="h-full flex flex-col border-2 rounded-sm shadow-sm hover:border-accent hover:shadow-md transition-all duration-200">
                  {post.imageUrl && (
                    <div className="h-48 w-full bg-muted overflow-hidden border-b-2">
                      <img 
                        src={post.imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <CardHeader className="flex-none">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground font-medium line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t bg-muted/10 font-bold text-sm flex items-center justify-between">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}