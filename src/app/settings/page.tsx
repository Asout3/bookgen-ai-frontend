"use client";

import { motion } from "framer-motion";
import { 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Shield, 
  Download, 
  Bell, 
  Palette,
  LogOut,
  Trash2,
  BookOpen,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/ThemeProvider";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("Please sign in to access settings");
      router.push("/login?redirect=/settings");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      localStorage.removeItem("bearer_token");
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Implement account deletion logic
      toast.error("Account deletion not implemented yet");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 max-w-4xl mx-auto px-4 p-8">
          <div className="space-y-6">
            <Card className="rounded-2xl p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 max-w-4xl mx-auto px-4 p-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated blurry background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      <Navbar />

      <div className="pt-20 max-w-4xl mx-auto px-4 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account preferences and customizations
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{session.user.name || "Anonymous User"}</h2>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 glass-card rounded-xl">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                  <div className="text-sm text-muted-foreground">Books Generated</div>
                </div>
                <div className="text-center p-4 glass-card rounded-xl">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.floor(Math.random() * 30) + 5}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
                <div className="text-center p-4 glass-card rounded-xl">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.floor(Math.random() * 1000) + 100}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Words</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Appearance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Appearance</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose between light and dark mode
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sun className="w-4 h-4 text-muted-foreground" />
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                    />
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your public books
                    </p>
                  </div>
                  <Switch
                    checked={publicProfile}
                    onCheckedChange={setPublicProfile}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Notifications</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your books are ready
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive tips and product updates
                    </p>
                  </div>
                  <Switch
                    checked={emailUpdates}
                    onCheckedChange={setEmailUpdates}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Book Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Book Preferences</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Download</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically download completed books
                    </p>
                  </div>
                  <Switch
                    checked={autoDownload}
                    onCheckedChange={setAutoDownload}
                  />
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/generate">
                    <Button variant="outline" className="w-full h-12 rounded-xl glass-card">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Create New Book
                    </Button>
                  </Link>
                  <Link href="/history">
                    <Button variant="outline" className="w-full h-12 rounded-xl glass-card">
                      <Download className="w-4 h-4 mr-2" />
                      View Library
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="glass-card rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Security</h3>
              </div>
              
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl glass-card"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl glass-card text-destructive hover:text-destructive border-destructive/20"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Account deletion is permanent and cannot be undone
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}