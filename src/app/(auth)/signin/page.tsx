"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

function SignInForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get("returnUrl");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push(returnUrl || "/dashboard");
    }
  }, [status, router, returnUrl]);

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);

    const response = await signIn("credentials", {
      redirect: false,
      identifier: values.identifier,
      password: values.password,
    });

    if (response?.ok) {
      toast({
        title: "Welcome Back!",
        description: "You have successfully logged in.",
      });
      router.replace(`/dashboard`);
    } else {
      toast({
        variant: "destructive",
        title: "Login failed.",
        description: "Please check your email and password.",
      });
    }
    setIsSubmitting(false);
  }

  async function handleGoogleLogin() {
    try {
      await signIn("google", { callbackUrl: returnUrl || "/dashboard" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed.",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <section className="w-full flex justify-center items-center p-8 min-h-screen">
      <div className="space-y-8 border-2 dark:border-white border-black p-8 rounded-xl container max-w-md max-h-fit">
        <h1 className="text-2xl font-bold leading-none tracking-tight">
          Welcome Back
        </h1>
        <h1 className="text-3xl font-bold leading-none tracking-tight">
          Sign In to True Feedback
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="text-sm">
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link className="hover:underline text-gray-100" href="/signup">
              Sign up
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Button variant={"secondary"} onClick={handleGoogleLogin}>
            <FaGoogle /> Continue with Google
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div><Loader2 className="animate-spin" /></div>}>
      <SignInForm />
    </Suspense>
  );
}
