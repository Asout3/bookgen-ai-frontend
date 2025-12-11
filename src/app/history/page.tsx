"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Download,
  Eye,
  Trash2,
  Filter,
  Calendar,
  FileText,
  MoreVertical,
  Loader2,
  Share2,
  Globe,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Book {
  id: number;
  title: string;
  genre: string;
  audience: string;
  chapters: number;
  totalWords: number;
  createdAt: string;
  status: string;
  coverUrl: string | null;
  authorName?: string;
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
}

export default function HistoryPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const itemsPerPage = 6;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      toast.error("Please sign in to view your books");
      router.push("/login?redirect=/history");
    }
  }, [session, sessionLoading, router]);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      if (!session?.user) return;

      try {
        const token = localStorage.getItem("bearer_token");
        const response = await fetch("/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchBooks();
    }
  }, [session]);

  const handleDelete = async (bookId: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    setDeleting(bookId);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks(books.filter((book) => book.id !== bookId));
      toast.success("Book deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete book");
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = (book: Book) => {
    const content = JSON.stringify(book, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${book.title.replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Book downloaded!");
  };

  const handleShare = async (book: Book) => {
    try {
      // Toggle book to public if not already public
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublic: !book.isPublic }),
      });

      if (!response.ok) {
        throw new Error("Failed to update book privacy");
      }

      // Update local state
      setBooks(books.map(b => 
        b.id === book.id ? { ...b, isPublic: !b.isPublic } : b
      ));

      // Show sharing link if book is now public
      if (!book.isPublic) {
        const shareUrl = `${window.location.origin}/share/${book.id}`;
        
        if (navigator.share) {
          await navigator.share({
            title: book.title,
            text: `Check out my book "${book.title}"`,
            url: shareUrl
          });
        } else {
          // Fallback to clipboard
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Share link copied to clipboard!");
        }
      } else {
        toast.success("Book made private");
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share book");
    }
  };

  // Filter and search logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = filterGenre === "all" || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  // Get unique genres from books
  const genres = Array.from(new Set(books.map((book) => book.genre)));

  // Cover image placeholders
  const coverImages = [
    "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
  ];

  // Show loading state while checking authentication
  if (sessionLoading || loading) {
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Your <span className="gradient-text">Library</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} in your collection
                </p>
              </div>
              <Link href="/generate">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                  Create New Book
                </Button>
              </Link>
            </div>

            {/* Search and Filter */}
            <Card className="glass-card rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search your books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-12 rounded-full"
                  />
                </div>
                <Select value={filterGenre} onValueChange={setFilterGenre}>
                  <SelectTrigger className="w-full md:w-48 h-12 rounded-full">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>

          {/* Books Grid */}
          {paginatedBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <BookOpen className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-2">
                {books.length === 0 ? "No books yet" : "No books found"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {books.length === 0
                  ? "Start creating your first book"
                  : "Try adjusting your search or filters"}
              </p>
              <Link href="/generate">
                <Button className="rounded-full bg-gradient-to-r from-primary to-purple-600">
                  Create Your First Book
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-all">
                      {/* Book Cover */}
                      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-purple-600/20">
                        <img
                          src={book.coverUrl || coverImages[index % coverImages.length]}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Quick Actions */}
                        <div className="absolute top-4 right-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownload(book)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare(book)}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(book.id)}
                                disabled={deleting === book.id}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {deleting === book.id ? "Deleting..." : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className="bg-green-500/90 text-white border-0">
                            {book.status}
                          </Badge>
                          <Badge variant="outline" className="glass-card border-white/30">
                            {book.isPublic ? (
                              <Globe className="w-3 h-3 mr-1" />
                            ) : (
                              <Lock className="w-3 h-3 mr-1" />
                            )}
                            {book.isPublic ? "Public" : "Private"}
                          </Badge>
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 line-clamp-1">
                          {book.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="secondary">{book.genre}</Badge>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Chapters</div>
                            <div className="font-semibold">{book.chapters}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Words</div>
                            <div className="font-semibold">{book.totalWords.toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 rounded-full"
                            onClick={() => handleDownload(book)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className="rounded-full w-10 h-10 p-0"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}