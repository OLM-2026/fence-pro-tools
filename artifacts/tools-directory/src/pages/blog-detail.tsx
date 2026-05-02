import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useGetBlogPost, getGetBlogPostQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function BlogPostDetail() {
  const { slug } = useParams();

  const { data: post, isLoading } = useGetBlogPost(slug || "", {
    query: { enabled: !!slug, queryKey: getGetBlogPostQueryKey(slug || "") }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-1/3 mb-12" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/blog">
          <Button className="rounded-sm font-bold">Return to Resources</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="animate-in fade-in duration-500 pb-20">
      <Helmet>
        <title>{post.title} - FenceProTools</title>
        <meta name="description" content={post.excerpt} />
        {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
      </Helmet>

      <div className="bg-muted/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center text-sm font-medium text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Resources
          </Link>
        </div>
      </div>

      <header className="container mx-auto px-4 max-w-3xl py-12">
        <div className="text-sm font-bold text-accent uppercase tracking-wider mb-4">
          {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
          {post.title}
        </h1>
        <p className="text-xl text-muted-foreground font-medium leading-relaxed border-l-4 border-muted pl-4">
          {post.excerpt}
        </p>
      </header>

      {post.imageUrl && (
        <div className="container mx-auto px-4 max-w-4xl mb-12">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-auto rounded-sm border-2 shadow-sm"
          />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl">
        <div 
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-sm prose-img:border-2 font-medium text-foreground/90"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div className="mt-16 pt-8 border-t-2 flex justify-between items-center">
          <p className="font-bold text-muted-foreground">Share this article</p>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-sm font-bold" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              // Could add a toast here
            }}>Copy Link</Button>
          </div>
        </div>
      </div>
    </article>
  );
}