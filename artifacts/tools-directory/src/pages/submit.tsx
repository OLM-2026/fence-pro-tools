import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { useSubmitTool, useListCategories } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  toolName: z.string().min(2, "Tool name is required"),
  category: z.string().min(1, "Please select a category"),
  website: z.string().url("Please enter a valid URL (include https://)"),
  contactEmail: z.string().email("Please enter a valid email address"),
  whyFencing: z.string().min(50, "Please provide more detail (min 50 characters)"),
});

export default function Submit() {
  const { toast } = useToast();
  const { data: categories } = useListCategories();
  const submitMutation = useSubmitTool();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      toolName: "",
      category: "",
      website: "https://",
      contactEmail: "",
      whyFencing: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          toast({
            title: "Tool submitted successfully!",
            description: "Our editorial team will review your submission shortly.",
          });
        },
        onError: () => {
          toast({
            title: "Submission failed",
            description: "There was an error submitting your tool. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Submission Received</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you. Our team will review the tool to ensure it meets our standards for fencing contractors.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="rounded-sm font-bold">Return Home</Button>
          </Link>
          <Button onClick={() => {
            form.reset();
            setIsSubmitted(false);
          }} className="rounded-sm font-bold bg-accent text-accent-foreground hover:bg-accent/90 border-accent">Submit Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl animate-in fade-in duration-300">
      <Helmet>
        <title>Submit a Tool - FenceProTools</title>
        <meta name="description" content="Submit software tools built for fencing contractors to be included in our directory." />
      </Helmet>

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Submit a Tool</h1>
        <p className="text-lg font-medium text-muted-foreground">
          Know software that helps fencing contractors? Let us know. We review every submission.
        </p>
      </div>

      <div className="bg-card border-2 rounded-sm p-6 md:p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Software" className="rounded-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Tool Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Estimator" className="rounded-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." className="rounded-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" className="rounded-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Primary Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-sm">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whyFencing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Why should fencing contractors know about this tool?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What specific problems does this solve for a fencing business?" 
                      className="min-h-[120px] resize-y rounded-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 border-t">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-sm"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Review"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}