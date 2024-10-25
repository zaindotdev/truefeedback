import React from "react";
import { Meteors } from "@/components/ui/meteors";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed top-0 left-0 right-0 bottom-0">
        <Meteors />
      </div>
      <div className="z-10">{children}</div>
    </div>
  );
};

export default Layout;
