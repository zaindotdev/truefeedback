"use client";
import React, { useEffect, useState } from "react";
import {
  Copy,
  Link,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const [copied, setCopied] = useState(false);
  const session = useSession();
  const feedbackUrl = `https://truefeedback.com/u/${session.data?.user.username}`;
  const { toast } = useToast();
  const [messages, setMessages] = useState<Array<Message>>([]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(feedbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMessages = async () => {
    try {
      const response = await axios.get("/api/get-message");
      console.log(response);
      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again later.",
        });
      }
      setMessages(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getMessages();
  }, []);
  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}
    >
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* URL Card */}
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

              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-900 dark:text-gray-100">
                  {feedbackUrl}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant={copied ? "outline" : "default"}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy URL
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Feedback
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    24
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    New (Last 24h)
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    3
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Positive Feedback
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    80%
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <ThumbsUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Recent Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  message:
                    "Great work on the project! The attention to detail was impressive.",
                  timestamp: "2 hours ago",
                  type: "positive",
                },
                {
                  message:
                    "Consider improving the documentation. Some parts were unclear.",
                  timestamp: "1 day ago",
                  type: "constructive",
                },
                {
                  message:
                    "Really appreciated your help during the team meeting.",
                  timestamp: "2 days ago",
                  type: "positive",
                },
              ].map((feedback, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-gray-800 dark:text-gray-200">
                    {feedback.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        feedback.type === "positive"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {feedback.type === "positive"
                        ? "Positive"
                        : "Constructive"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {feedback.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
