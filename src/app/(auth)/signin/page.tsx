"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

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
      router.replace("/dashboard");
    } else if (response?.error === "CredentialsSignin") {
      toast({
        variant: "destructive",
        title: "Invalid credentials.",
        description: "Please check your email and password.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login failed.",
        description: "An unexpected error occurred. Please try again.",
      });
    }

    setIsSubmitting(false);
  }

  return (
    <section className="w-full h-screen flex items-center justify-center p-8">
      <div className="space-y-8 border-2 dark:border-white border-black p-8 rounded-xl md:w-1/2 w-full">
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@email.com"
                        type="email"
                        {...field}
                      />
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
            <Link className="hover:underline text-blue-800" href="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
