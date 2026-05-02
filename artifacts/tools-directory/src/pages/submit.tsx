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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const formSchema = z.object({
  name: z.string().min(2, "Tool name must be at least 2 characters"),
  website: z.string().url("Please enter a valid URL (include https://)"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(50, "Please provide a detailed description (min 50 characters)"),
  submitterEmail: z.string().email("Please enter a valid email address"),
  submitterName: z.string().min(2, "Your name is required"),
});

export default function Submit() {
  const { toast } = useToast();
  const { data: categories } = useListCategories();
  const submitMutation = useSubmitTool();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website: "https://",
      category: "",
      description: "",
      submitterEmail: "",
      submitterName: "",
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
            description: "Our team will review your submission shortly.",
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
        <h1 className="text-3xl font-bold mb-4">Submission Received!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for contributing to the directory. Our editorial team will review your submission and publish it if it meets our criteria for home service professionals.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">Return to Directory</Button>
          </Link>
          <Button onClick={() => {
            form.reset();
            setIsSubmitted(false);
          }}>Submit Another Tool</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl animate-in fade-in duration-300">
      <Helmet>
        <title>Submit a Tool - Tools for Home Services</title>
        <meta name="description" content="Submit software tools built for home service businesses to be included in our directory." />
      </Helmet>

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Submit a Tool</h1>
        <p className="text-lg text-muted-foreground">
          Know a great piece of software for contractors, plumbers, landscapers, or cleaners? Let us know.
        </p>
      </div>

      <Card className="border-t-4 border-t-accent shadow-lg">
        <CardHeader>
          <CardTitle>Tool Details</CardTitle>
          <CardDescription>
            All submissions are manually reviewed before publishing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Software Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ServiceTitan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
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
                    <FormLabel>Primary Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                    <FormDescription>
                      Which trade or function does this tool primarily serve?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What makes this tool great for home service pros? What are its main features?" 
                        className="min-h-[120px] resize-y"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="col-span-full">
                  <h3 className="text-lg font-medium">Your Information</h3>
                  <p className="text-sm text-muted-foreground">So we can contact you if we have questions.</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="submitterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="submitterEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Tool for Review"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
