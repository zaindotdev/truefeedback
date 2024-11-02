"use client";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const VerifyPage = () => {
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
    mode: "onChange",
  });

  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const verifyUser = async (data: z.infer<typeof verifySchema>) => {
    setIsVerifying(true);

    try {
      const response = await axios.post("/api/verify-user", {
        username,
        ...data,
      });

      if (response.status === 200) {
        toast({
          title: "Account verified.",
          description: "Your account has been verified successfully.",
        });
        router.push(`/dashboard`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: "Verification failed.",
          description:
            error.response?.status === 404
              ? "The verification code is incorrect."
              : "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="border-2 dark:border-white border-black p-8 rounded-xl max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight leading-none mb-4">
          Hello, @{username}!
        </h1>
        <p className="text-lg mb-6">
          A verification code has been sent to your email. Please enter it below
          to continue.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(verifyUser)}>
            <div className="mt-4 flex items-center justify-center">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormControl>
                    <InputOTP
                      value={field.value}
                      onChange={field.onChange}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isVerifying || !form.formState.isValid}
              className="mt-6"
            >
              {isVerifying ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyPage;
