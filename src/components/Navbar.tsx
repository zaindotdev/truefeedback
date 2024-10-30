"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ModeToggle } from "./ui/mode-toggle";
import { LogIn, Shield } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { Button } from "./ui/button";

const Navbar = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2"
            />
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Shield />
              TrueFeedback
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user.authenticated ? (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {username}
              </span>
            ) : (
              <span>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => router.replace("/signin")}
                >
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
