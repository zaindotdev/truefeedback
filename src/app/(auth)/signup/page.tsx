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
import { signUpSchema } from "@/schemas/signUpSchema";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { signIn } from "next-auth/react";
import {FaGoogle} from "react-icons/fa"

export default function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkUniqueUsername = async () => {
      setIsCheckingUsername(true);
      setUsernameMessage(""); // Clear message during check
      if (!username) {
        setUsernameMessage("");
        setIsCheckingUsername(false);
        return;
      }
      try {
        const response = await axios.get(
          `/api/validate-username?username=${username}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError instanceof Error) {
          console.error(axiosError);
          setUsernameMessage(
            "User name should be unique and can only contain letters, numbers, and underscores. Also it should be at least 4 characters long."
          );
        }
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUniqueUsername();
  }, [debounced, username]);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    try {
      const userAccount = await axios.post<ApiResponse>(`/api/signup`, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      if (userAccount) {
        toast({
          title: "Account created",
          description: "We've created your account for you.",
        });
        router.replace(`/verify/${values.username}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User Already Exists",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    const response = await signIn("google", { callbackUrl: "/dashboard" });
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Login failed.",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <section className="w-full flex items-center justify-center p-8 min-h-screen">
      <div className="space-y-8 border-2 dark:border-white border-black p-8 rounded-xl container max-w-md max-h-fit">
        <h2 className="text-2xl leading-none tracking-tight">
          New to True Feedback?
        </h2>
        <h1 className="text-3xl font-bold leading-none tracking-tight">
          Sign Up
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe"
                      {...field}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value); // Correct debounced usage
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <p className="text-sm text-gray-500">
                      Checking username...
                    </p>
                  )}
                  <p
                    className={`text-sm ${
                      usernameMessage.includes("exists") ||
                      usernameMessage.includes("4 characters")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                    aria-live="polite"
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
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
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading || isCheckingUsername}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Sign up"}
            </Button>
          </form>
        </Form>

        <div className="text-sm">
          <p className="text-center">
            Already have an account?{" "}
            <Link
              href={"/signin"}
              className="hover:underline duration-200 text-gray-100"
            >
              Sign in
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
