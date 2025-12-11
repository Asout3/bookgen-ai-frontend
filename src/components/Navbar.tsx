"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { Moon, Sun, Sparkles, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error("Failed to sign out");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/login");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass-nav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold gradient-text">BookGen.ai</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-10 h-10 hover:scale-110 transition-all"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 transition-transform hover:rotate-12" />
                ) : (
                  <Sun className="w-5 h-5 transition-transform hover:rotate-12" />
                )}
              </Button>
            )}

            {!isPending && session?.user ? (
              <>
                <Link href="/settings">
                  <Button variant="ghost" className="rounded-full h-10 px-4 hover:scale-105 transition-all hidden sm:flex">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="rounded-full h-10 px-4 hover:scale-105 transition-all hidden sm:flex"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                <Link href="/generate">
                  <Button className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover:scale-105 hover:shadow-lg transition-all h-10 px-6 font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full h-10 px-4 hover:scale-105 transition-all hidden sm:flex">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover:scale-105 hover:shadow-lg transition-all h-10 px-6 font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}