"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ModeToggle } from "./ui/mode-toggle";
import { LogIn, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { status, data: session } = useSession();
  const router = useRouter();

  const logOut = async (): Promise<void> => {
    try {
      await signOut({ redirect: true, callbackUrl: "/signin" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Shield />
              <Link
                href={`/dashboard`}
                className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2"
              >
                TrueFeedback
              </Link>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {status === "authenticated" ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300 sm:block hidden">
                  Welcome, {session?.user.name || session?.user.username}
                </span>
                <span>
                  <Button size={"icon"} variant={"outline"} onClick={logOut}>
                    <LogOut />
                  </Button>
                </span>
              </>
            ) : (
                <span>
                <Button
                  className="flex items-center justify-center gap-2"
                  size={"lg"}
                  variant={"outline"}
                  onClick={() => router.replace("/signin")}
                  >
                    <p className="sm:block hidden">Login</p>
                  <LogIn />
                </Button>
              </span>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
