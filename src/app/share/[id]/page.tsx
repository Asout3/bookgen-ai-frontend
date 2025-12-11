"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Download, 
  Share2, 
  Clock, 
  User, 
  Calendar,
  Eye,
  FileText,
  Heart,
  Star,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

interface BookData {
  id: string;
  title: string;
  description?: string;
  content?: string;
  genre?: string;
  authorName?: string;
  createdAt: string;
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
}

export default function SharePage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBook();
  }, [params.id]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/share/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setBook(null);
        } else {
          throw new Error('Failed to fetch book');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error("Error fetching book:", error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!book) return;
    
    setDownloading(true);
    try {
      // Track download
      await fetch(`/api/share/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'download' })
      });
      
      // In real implementation, this would trigger actual download
      // For now, we'll just show success and potentially increment local count
      setBook(prev => prev ? {
        ...prev,
        downloadCount: prev.downloadCount + 1
      } : null);
      
      toast.success("Download started!");
    } catch (error) {
      toast.error("Download tracking failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && book) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.authorName}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Removed from favorites" : "Added to favorites");
  };

  if (!mounted) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 max-w-4xl mx-auto px-4 p-8">
          <div className="space-y-6">
            <Card className="rounded-2xl p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 max-w-4xl mx-auto px-4 p-8">
          <Card className="glass-card rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The book you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-primary to-purple-600">
                Go Home
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated blurry background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"
        />
      </div>

      <Navbar />

      <div className="pt-20 max-w-4xl mx-auto px-4 p-8">
        {/* Book Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card rounded-3xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Book Cover Placeholder */}
              <div className="lg:w-64 lg:h-80 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-24 h-24 text-primary/60" />
              </div>

              {/* Book Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                  {book.description && (
                    <p className="text-lg text-muted-foreground">{book.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {book.genre && (
                    <Badge variant="secondary" className="rounded-full">
                      <FileText className="w-3 h-3 mr-1" />
                      {book.genre}
                    </Badge>
                  )}
                  <Badge variant="outline" className="rounded-full">
                    <Eye className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                </div>

                {book.authorName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>by {book.authorName}</span>
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{book.viewCount.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{book.downloadCount.toLocaleString()} downloads</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="bg-gradient-to-r from-primary to-purple-600 rounded-full px-6 h-12"
                  >
                    {downloading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="rounded-full px-6 h-12 glass-card"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>

                  <Button
                    onClick={handleLike}
                    variant="outline"
                    className={`rounded-full px-6 h-12 glass-card ${liked ? 'text-primary border-primary' : ''}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                    {liked ? "Liked" : "Like"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Book Content Preview */}
        {book.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Book Preview</h2>
                <Badge variant="secondary" className="rounded-full">
                  Sample Content
                </Badge>
              </div>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-base leading-relaxed">
                  {book.content}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-muted-foreground mb-4">
                  Want to read the complete book?
                </p>
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-primary to-purple-600 rounded-full px-8 h-12">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Sign Up to Read More
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Card className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">About This Book</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">4.8</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">156</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="text-center p-4 glass-card rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">92%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 glass-card rounded-xl">
              <p className="text-sm text-muted-foreground text-center">
                This book was generated using AI by BookGen.ai. 
                <Link href="/" className="underline hover:text-foreground ml-1">
                  Create your own book today!
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}