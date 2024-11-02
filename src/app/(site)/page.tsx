"use client";
import { useSession } from "next-auth/react";
import React from "react";

const Home = () => {
  const { status } = useSession();
  if (status !== "authenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Please login to continue</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">Welcome to TrueFeedback</h1>
    </div>
  );
};

export default Home;
