"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Wand2,
  Download,
  FileText,
  Users,
  Target,
  Settings,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GeneratePage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [generatedBook, setGeneratedBook] = useState<any>(null);
  const [bookData, setBookData] = useState({
    title: "",
    genre: "",
    audience: "",
    description: "",
    bookLength: "mid" as "short" | "mid" | "long",
    tone: "",
    style: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      toast.error("Please sign in to generate books");
      router.push("/login?redirect=/generate");
    }
  }, [session, sessionLoading, router]);

  const handleGenerate = async () => {
    if (!session?.user) {
      toast.error("Please sign in to generate books");
      router.push("/login?redirect=/generate");
      return;
    }

    setGenerating(true);
    setProgress(0);
    setProgressMessage("Initializing...");

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/books/generate/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: bookData.title,
          genre: bookData.genre,
          audience: bookData.audience,
          description: bookData.description,
          tone: bookData.tone,
          style: bookData.style,
          bookLength: bookData.bookLength,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start book generation");
      }

      // Read the stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.error) {
              throw new Error(data.error);
            }

            if (data.progress !== undefined) {
              setProgress(data.progress);
              if (data.message) {
                setProgressMessage(data.message);
              }
            }

            if (data.book) {
              setGeneratedBook(data.book);
              toast.success("Book generated successfully!");
            }
          }
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate book"
      );
      setGenerating(false);
      setProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!generatedBook) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/books/${generatedBook.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch book content");
      }

      const book = await response.json();
      const content = book.content || JSON.stringify(book, null, 2);
      
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${generatedBook.title.replace(/\s+/g, "-")}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Book downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download book");
    }
  };

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
    "Thriller",
    "Self-Help",
    "Business",
    "Biography",
  ];

  const audiences = [
    "Children (5-12)",
    "Young Adult (13-18)",
    "Adults (18+)",
    "Professionals",
    "General Audience",
  ];

  const tones = [
    "Professional",
    "Casual",
    "Formal",
    "Humorous",
    "Inspirational",
    "Educational",
  ];

  const styles = [
    "Descriptive",
    "Narrative",
    "Persuasive",
    "Expository",
    "Creative",
  ];

  const bookLengths = [
    { value: "short", label: "Short Book", chapters: 5, words: "~7,500 words", time: "5-10 min" },
    { value: "mid", label: "Medium Book", chapters: 10, words: "~20,000 words", time: "10-20 min" },
    { value: "long", label: "Long Book", chapters: 15, words: "~37,500 words", time: "20-30 min" },
  ];

  // Show loading state while checking authentication
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 hover:shadow-lg transition-shadow">
              <Wand2 className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">AI Book Generator</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Create Your <span className="gradient-text">Book</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Fill in the details and let AI create your masterpiece
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!generating && progress === 0 ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-card rounded-3xl p-8 md:p-12 shadow-xl">
                  <div className="space-y-8">
                    {/* Book Title */}
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-lg font-bold">
                        Book Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter your book title..."
                        value={bookData.title}
                        onChange={(e) =>
                          setBookData({ ...bookData, title: e.target.value })
                        }
                        className="h-14 rounded-2xl text-lg focus:scale-[1.01] transition-transform"
                      />
                    </div>

                    {/* Genre & Audience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-bold">Genre *</Label>
                        <Select
                          value={bookData.genre}
                          onValueChange={(value) =>
                            setBookData({ ...bookData, genre: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-2xl text-lg hover:border-ring/50 transition-all">
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                          <SelectContent>
                            {genres.map((genre) => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-bold">
                          Target Audience *
                        </Label>
                        <Select
                          value={bookData.audience}
                          onValueChange={(value) =>
                            setBookData({ ...bookData, audience: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-2xl text-lg hover:border-ring/50 transition-all">
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            {audiences.map((audience) => (
                              <SelectItem key={audience} value={audience}>
                                {audience}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="description"
                        className="text-lg font-bold"
                      >
                        Book Description *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your book's plot, themes, and key points. The more details, the better!"
                        value={bookData.description}
                        onChange={(e) =>
                          setBookData({
                            ...bookData,
                            description: e.target.value,
                          })
                        }
                        className="min-h-[150px] rounded-2xl text-lg resize-none focus:scale-[1.01] transition-transform"
                      />
                    </div>

                    {/* Tone & Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-lg font-bold">Tone *</Label>
                        <Select
                          value={bookData.tone}
                          onValueChange={(value) =>
                            setBookData({ ...bookData, tone: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-2xl text-lg hover:border-ring/50 transition-all">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            {tones.map((tone) => (
                              <SelectItem key={tone} value={tone}>
                                {tone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-lg font-bold">
                          Writing Style *
                        </Label>
                        <Select
                          value={bookData.style}
                          onValueChange={(value) =>
                            setBookData({ ...bookData, style: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-2xl text-lg hover:border-ring/50 transition-all">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            {styles.map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Book Length Selection */}
                    <div className="space-y-5">
                      <Label className="text-lg font-bold">Book Length *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {bookLengths.map((length) => (
                          <button
                            key={length.value}
                            onClick={() => setBookData({ ...bookData, bookLength: length.value as "short" | "mid" | "long" })}
                            className={`glass-card rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:scale-105 ${
                              bookData.bookLength === length.value
                                ? "ring-2 ring-primary bg-primary/10 shadow-lg"
                                : ""
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-bold text-lg">{length.label}</h3>
                              {bookData.bookLength === length.value && (
                                <CheckCircle2 className="w-5 h-5 text-primary animate-pulse" />
                              )}
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span>{length.chapters} Chapters</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{length.words}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4" />
                                <span>{length.time}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={
                        !bookData.title ||
                        !bookData.genre ||
                        !bookData.audience ||
                        !bookData.description ||
                        !bookData.tone ||
                        !bookData.style
                      }
                      className="w-full h-16 rounded-2xl text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover:scale-[1.02] hover:shadow-xl transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Wand2 className="w-6 h-6 mr-2" />
                      Generate My Book
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl">
                  <div className="text-center space-y-10">
                    {/* Progress Animation */}
                    <div className="relative">
                      <div className="w-40 h-40 mx-auto relative">
                        <svg
                          className="w-40 h-40 transform -rotate-90"
                          viewBox="0 0 120 120"
                        >
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-muted/20"
                          />
                          <motion.circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={339.292}
                            initial={{ strokeDashoffset: 339.292 }}
                            animate={{
                              strokeDashoffset: 339.292 - (339.292 * progress) / 100,
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          />
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold gradient-text">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {progress < 100 ? (
                      <>
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Creating Your Book...
                          </h2>
                          <p className="text-lg text-muted-foreground">
                            {progressMessage || "Initializing..."}
                          </p>
                        </div>

                        {/* Progress Steps */}
                        <div className="space-y-4 text-left max-w-md mx-auto">
                          {[
                            { label: "Setting up generation", threshold: 5 },
                            { label: "Creating table of contents", threshold: 15 },
                            { label: "Writing chapters", threshold: 85 },
                            { label: "Finalizing your book", threshold: 95 },
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2, ease: [0.4, 0, 0.2, 1] }}
                              className="flex items-center gap-4 glass-card rounded-xl p-4"
                            >
                              {progress > item.threshold ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                              ) : (
                                <Loader2 className="w-6 h-6 text-primary animate-spin flex-shrink-0" />
                              )}
                              <span
                                className={`text-base font-medium ${
                                  progress > item.threshold
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {item.label}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                          </div>
                          <h2 className="text-3xl font-bold mb-2">
                            Your Book is Ready!
                          </h2>
                          <p className="text-muted-foreground mb-8">
                            Your book has been successfully generated and saved to your library.
                          </p>
                        </div>

                        {/* Book Preview */}
                        {generatedBook && (
                          <div className="space-y-4 max-w-2xl mx-auto">
                            <div className="glass-card rounded-2xl p-6 text-left">
                              <h3 className="text-2xl font-bold mb-2">
                                {generatedBook.title}
                              </h3>
                              <p className="text-muted-foreground mb-4">
                                {generatedBook.genre} • {generatedBook.chapters} Chapters •{" "}
                                {generatedBook.totalWords.toLocaleString()} words
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {generatedBook.description}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            size="lg"
                            onClick={handleDownload}
                            className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                          >
                            <Download className="w-5 h-5 mr-2" />
                            Download Book
                          </Button>
                          <Link href="/history">
                            <Button
                              size="lg"
                              variant="outline"
                              className="rounded-full"
                            >
                              <BookOpen className="w-5 h-5 mr-2" />
                              View All Books
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}