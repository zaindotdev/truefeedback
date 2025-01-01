"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Copy,
  MessageSquare,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Trash,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { ApiResponse } from "@/types/types";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogTrigger,DialogClose,DialogContent,DialogFooter,DialogHeader, DialogDescription, DialogTitle, } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackUrl, setFeedbackUrl] = useState<string>("");
  const username = session?.user?.name || session?.user?.username;
  const sanitizedUsername = username?.replace(" ", "%20");
  const [feedbackCategory, setFeedbackCategory] = useState<string>("teaching");
  const [deletingMessage, setDeletingMessage] = useState<boolean>(false);
  const selectOptions = [
    { value: "teaching", label: "Teaching" },
    { value: "learning", label: "Learning" },
    { value: "assessment", label: "Assessment" },
    {value:"other", label:"Other"}
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && session?.user) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setFeedbackUrl(`${baseUrl}/u/${sanitizedUsername}?category=${feedbackCategory}`);
    }
  }, [session, feedbackCategory, sanitizedUsername]);
  
  const onValueChange = (value: string) => {
    setFeedbackCategory(value);
  }

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    defaultValues: { acceptMessage: true },
    resolver: zodResolver(acceptMessageSchema),
  });

  const acceptMessages = form.watch("acceptMessage");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(feedbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      if (response.status === 200) {
        form.setValue("acceptMessage", response.data.isAcceptingMessage);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMessages = useCallback(async () => {
    try {
      const response = await axios.get("/api/get-message");
      if (response.status === 200) setMessages(response.data.messages || []);
      else showErrorToast();
    } catch (error) {
      console.error(error);
    }
  }, [toast]);

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/?messageId=${messageId}`
      );
      if (response.status === 200)
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      else showErrorToast();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const onSubmit = async (values: z.infer<typeof acceptMessageSchema>) => {
    try {
      const response = await axios.post("/api/accept-messages", {
        isAcceptingMessage: values.acceptMessage,
      });

      if (response.status === 200) {
        // Update the form value directly to reflect the change
        form.setValue("acceptMessage", values.acceptMessage);

        // Display success message
        toast({
          title: "Success",
          description: response.data.message,
        });
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleAxiosError = (error: unknown) => {
    if (error instanceof Error) console.error(error.message);
    showErrorToast();
  };

  const showErrorToast = () => {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Something went wrong. Please try again later.",
    });
  };

  useEffect(() => {
    if (session?.user) {
      getMessages();
      fetchAcceptMessages();
    }
  }, [getMessages, session, fetchAcceptMessages, form.setValue]);

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10"/>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Your Feedback URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                <AlertDescription className="text-sm text-gray-600 dark:text-gray-300">
                  Share this URL with people to receive anonymous feedback.
                  Anyone with this link can send you feedback anonymously.
                </AlertDescription>
              </Alert>
              <div className="md:flex items-center gap-4">
                <div className="flex-1  bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-900 dark:text-gray-100">
                  {feedbackUrl}
                </div>
                <div className="flex items-center gap-2 border-[2px] dark:border-gray-200 border-gray-900 rounded-lg">
                  <Select
                    value={feedbackCategory}
                    onValueChange={onValueChange}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select a Category</SelectLabel>
                        {selectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant={copied ? "outline" : "default"}
                  className="gap-2 sm:mt-0 mt-4"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy URL
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Feedback",
              count: messages.length,
              Icon: MessageSquare,
            },
            { title: "New (Last 24h)", count: 3, Icon: Clock },
            { title: "Positive Feedback", count: "80%", Icon: ThumbsUp },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.count}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-opacity-10">
                    <stat.Icon
                      className={`h-6 w-6 ${
                        idx === 0
                          ? "text-blue-500 dark:text-blue-600"
                          : idx === 1
                          ? "text-green-500 dark:text-green-600"
                          : " text-yellow-500 dark:text-yellow-600"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Form {...form}>
          <FormField
            name="acceptMessage"
            control={form.control}
            render={({ field }) => (
              <div className="mb-8 flex items-center gap-2">
                Accept Messages
                <FormControl>
                  <Switch
                    {...form.register("acceptMessage")}
                    checked={acceptMessages}
                    onCheckedChange={(checked) =>
                      onSubmit({ acceptMessage: checked })
                    }
                    disabled={isLoading}
                  />
                </FormControl>
              </div>
            )}
          />
        </Form>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Recent Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 overflow-y-auto">
              {messages.length === 0 ? (
                <Alert>
                  <AlertDescription>No feedback received yet.</AlertDescription>
                </Alert>
              ) : (
                messages.map((feedback: Message) => (
                  <div className="space-y-4" key={feedback.content}>
                    {/* Category Section */}
                    <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex flex-col gap-2">
                      <h3 className="text-gray-700 dark:text-gray-300 text-sm font-semibold uppercase tracking-wide">
                        Category
                      </h3>
                      <p className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium p-4 rounded-md capitalize">
                        {feedback.category}
                      </p>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <p className="text-gray-800 dark:text-gray-200">
                        {feedback.content}
                      </p>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setDeletingMessage(true)}
                            variant="destructive"
                            aria-label="Delete feedback"
                          >
                            <Trash />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Feedback</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this feedback?
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <Separator />
                          <DialogFooter className="flex md:flex-row flex-col gap-2">
                            <Button
                              variant="destructive"
                              onClick={() =>
                                deleteMessage(feedback?._id as string)
                              }
                            >
                              Delete
                            </Button>
                            <DialogClose asChild>
                              <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
               ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
