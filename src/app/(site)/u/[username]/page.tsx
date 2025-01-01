"use client";
import React, { useEffect } from "react";
import {
  Send,
  Shield,
  Lock,
  MessageSquare,
  Loader2,
  AlertTriangleIcon,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";

const User = () => {
  const { username } = useParams();
  const { status, data: session } = useSession();
  const { toast } = useToast();
  const sanitizedUsername = Array.isArray(username)
    ? username[0].replace("%20", " ")
    : username?.replace("%20", " ");
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const router = useRouter();

  useEffect(() => { 
    if (status === "unauthenticated") {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "You must be signed in to send feedback.",
      })
      const returnUrl = window.location.pathname + window.location.search;
      router.push(`/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  },[status, router]);

  const form = useForm<z.infer<typeof messageSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(messageSchema),
  });
  async function onSubmit(values: z.infer<typeof messageSchema>) {
    setIsSubmitting(true);
    try {
      // Proceed to send the message if not messaging themselves
      const response = await axios.post(`/api/send-message`, {
        username: sanitizedUsername,
        content: values.content,
        category,
      });

      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Message failed to send",
          description: "The user might not want to receive the message.",
        });
        return;
      }

      form.reset();
      toast({
        title: "Feedback sent",
        description: "Your feedback has been successfully submitted.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Message failed to send",
          description: "There was an error processing your request.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (
    session?.user.username === sanitizedUsername ||
    session?.user.name === sanitizedUsername
  ) {
    return (
      <div className="flex justify-center p-8">
        <Alert variant={"destructive"}>
          <div className="flex items-center gap-2">
            <AlertTriangleIcon size={16} />
            <AlertDescription>
              You cannot send feedback to yourself.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Feedback to @{sanitizedUsername}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Your feedback will be completely anonymous. No personal
              information will be collected or shared.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Privacy Notice */}
                <Alert className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                  <AlertDescription className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Your message will be sent anonymously. No IP addresses or
                    personal data are stored.
                  </AlertDescription>
                </Alert>

                {/* Feedback Input */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your anonymous feedback here..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {field.value.length}/255 characters
                      </p>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-end items-center gap-2">
                  <Button type="button" variant={"ghost"} onClick={() => router.replace("/dashboard")}>
                    <ArrowLeft />
                    Back to Dashboard
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Feedback Sent" : "Send Feedback"}
                  </Button>
                </div>

                {/* Guidelines */}
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Feedback Guidelines:
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                    <li>Be specific and constructive in your feedback</li>
                    <li>
                      Focus on actions and behaviors, not personal attacks
                    </li>
                    <li>Provide examples when possible</li>
                    <li>Be respectful and professional</li>
                  </ul>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              100% Anonymous
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No personal data collected
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Secure & Private
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              End-to-end encrypted
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Direct Delivery
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Instantly delivered
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default User;
