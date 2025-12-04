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
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function GeneratePage() {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bookData, setBookData] = useState({
    title: "",
    genre: "",
    audience: "",
    description: "",
    chapters: 10,
    wordsPerChapter: 2000,
    tone: "",
    style: "",
  });

  const handleGenerate = () => {
    setGenerating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              <Wand2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI Book Generator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create Your <span className="gradient-text">Book</span>
            </h1>
            <p className="text-xl text-muted-foreground">
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
                <Card className="glass-card rounded-3xl p-8 md:p-12">
                  <div className="space-y-8">
                    {/* Book Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-lg font-semibold">
                        Book Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter your book title..."
                        value={bookData.title}
                        onChange={(e) =>
                          setBookData({ ...bookData, title: e.target.value })
                        }
                        className="h-14 rounded-2xl text-lg"
                      />
                    </div>

                    {/* Genre & Audience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-lg font-semibold">Genre *</Label>
                        <Select
                          value={bookData.genre}
                          onValueChange={(value) =>
                            setBookData({ ...bookData, genre: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-2xl text-lg">
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

                      <div className="space-y-2">
                        <Label className="text-lg font-semibold">
                          Target Audience *
                        </Label>
                        <Select
                          value={bookData.audience}
                          onValueChange={(value) =>
                            setBookData({ ...bookData, audience: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-2xl text-lg">
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
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-lg font-semibold"
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
                        className="min-h-[150px] rounded-2xl text-lg resize-none"
                      />
                    </div>

                    {/* Tone & Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-lg font-semibold">Tone *</Label>
                        <Select
                          value={bookData.tone}
                          onValueChange={(value) =>
                            setBookData({ ...bookData, tone: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-2xl text-lg">
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

                      <div className="space-y-2">
                        <Label className="text-lg font-semibold">
                          Writing Style *
                        </Label>
                        <Select
                          value={bookData.style}
                          onValueChange={(value) =>
                            setBookData({ ...bookData, style: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-2xl text-lg">
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

                    {/* Chapters Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Number of Chapters
                        </Label>
                        <span className="text-2xl font-bold gradient-text">
                          {bookData.chapters}
                        </span>
                      </div>
                      <Slider
                        value={[bookData.chapters]}
                        onValueChange={(value) =>
                          setBookData({ ...bookData, chapters: value[0] })
                        }
                        min={5}
                        max={30}
                        step={1}
                        className="py-4"
                      />
                    </div>

                    {/* Words per Chapter Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Words per Chapter
                        </Label>
                        <span className="text-2xl font-bold gradient-text">
                          {bookData.wordsPerChapter.toLocaleString()}
                        </span>
                      </div>
                      <Slider
                        value={[bookData.wordsPerChapter]}
                        onValueChange={(value) =>
                          setBookData({
                            ...bookData,
                            wordsPerChapter: value[0],
                          })
                        }
                        min={500}
                        max={5000}
                        step={100}
                        className="py-4"
                      />
                    </div>

                    {/* Total Words Display */}
                    <div className="glass-card rounded-2xl p-6 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold gradient-text">
                          {bookData.chapters}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Chapters
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold gradient-text">
                          {(
                            bookData.chapters * bookData.wordsPerChapter
                          ).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Words
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold gradient-text">
                          ~
                          {Math.round(
                            (bookData.chapters * bookData.wordsPerChapter) / 250
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Pages
                        </div>
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
                      className="w-full h-16 rounded-2xl text-lg bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
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
              >
                <Card className="glass-card rounded-3xl p-8 md:p-12">
                  <div className="text-center space-y-8">
                    {/* Progress Animation */}
                    <div className="relative">
                      <div className="w-32 h-32 mx-auto relative">
                        <svg
                          className="w-32 h-32 transform -rotate-90"
                          viewBox="0 0 120 120"
                        >
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-muted/30"
                          />
                          <motion.circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={339.292}
                            initial={{ strokeDashoffset: 339.292 }}
                            animate={{
                              strokeDashoffset: 339.292 - (339.292 * progress) / 100,
                            }}
                            transition={{ duration: 0.5 }}
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
                          <span className="text-3xl font-bold gradient-text">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {progress < 100 ? (
                      <>
                        <div>
                          <h2 className="text-3xl font-bold mb-2">
                            Creating Your Book...
                          </h2>
                          <p className="text-muted-foreground">
                            Our AI is crafting your masterpiece. This may take a few
                            moments.
                          </p>
                        </div>

                        {/* Progress Steps */}
                        <div className="space-y-4 text-left max-w-md mx-auto">
                          {[
                            { label: "Analyzing your requirements", complete: progress > 20 },
                            { label: "Generating chapter outlines", complete: progress > 40 },
                            { label: "Writing content", complete: progress > 60 },
                            { label: "Formatting and polishing", complete: progress > 80 },
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                              className="flex items-center gap-3"
                            >
                              {item.complete ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                              ) : (
                                <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
                              )}
                              <span
                                className={
                                  item.complete
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }
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
                            Your book has been successfully generated and is ready for
                            download.
                          </p>
                        </div>

                        {/* Book Preview Skeleton */}
                        <div className="space-y-4 max-w-2xl mx-auto">
                          <div className="glass-card rounded-2xl p-6 text-left">
                            <h3 className="text-2xl font-bold mb-2">
                              {bookData.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {bookData.genre} • {bookData.chapters} Chapters •{" "}
                              {(
                                bookData.chapters * bookData.wordsPerChapter
                              ).toLocaleString()}{" "}
                              words
                            </p>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            size="lg"
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
