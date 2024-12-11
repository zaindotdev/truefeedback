"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import { MessageSquare, ThumbsUp, Users } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Home = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-blue-600">
            Welcome to TrueFeedback
          </CardTitle>
          <CardDescription className="text-xl mt-2">
            Empower your decisions with authentic insights
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-blue-500" />}
            title="Collect Feedback"
            description="Gather valuable insights from your users effortlessly"
          />
          <FeatureCard
            icon={<ThumbsUp className="h-8 w-8 text-green-500" />}
            title="Analyze Responses"
            description="Make data-driven decisions with powerful analytics"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-500" />}
            title="Engage Users"
            description="Build stronger relationships with your audience"
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button size="lg" onClick={() => router.push("/signin")}>
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const FeatureCard:React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>{description}</p>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900 p-4">
    <Card className="w-full max-w-4xl">
      <CardHeader className="text-center">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mt-2" />
            </CardContent>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  </div>
);

export default Home;
