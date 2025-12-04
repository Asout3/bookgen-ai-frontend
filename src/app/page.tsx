"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  BookOpen, 
  Zap, 
  Shield, 
  Check, 
  ArrowRight,
  Brain,
  FileText,
  Users,
  TrendingUp,
  Quote
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BackToTop from "@/components/BackToTop";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Famous quotes about knowledge and books
const allQuotes = [
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    title: "Author"
  },
  {
    text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin",
    title: "Author"
  },
  {
    text: "Books are a uniquely portable magic.",
    author: "Stephen King",
    title: "Author"
  },
  {
    text: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
    title: "Author"
  },
  {
    text: "A room without books is like a body without a soul.",
    author: "Marcus Tullius Cicero",
    title: "Philosopher"
  },
  {
    text: "So many books, so little time.",
    author: "Frank Zappa",
    title: "Musician"
  },
  {
    text: "Reading is essential for those who seek to rise above the ordinary.",
    author: "Jim Rohn",
    title: "Entrepreneur"
  },
  {
    text: "I have always imagined that Paradise will be a kind of library.",
    author: "Jorge Luis Borges",
    title: "Writer"
  },
  {
    text: "Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors.",
    author: "Charles William Eliot",
    title: "Educator"
  },
  {
    text: "Knowledge is power. Information is liberating. Education is the premise of progress.",
    author: "Kofi Annan",
    title: "UN Secretary-General"
  },
  {
    text: "The only thing that you absolutely have to know is the location of the library.",
    author: "Albert Einstein",
    title: "Physicist"
  },
  {
    text: "Today a reader, tomorrow a leader.",
    author: "Margaret Fuller",
    title: "Writer"
  }
];

export default function Home() {
  const [quotes, setQuotes] = useState<typeof allQuotes>([]);

  useEffect(() => {
    // Shuffle and select 4 random quotes on mount
    const shuffled = [...allQuotes].sort(() => Math.random() - 0.5);
    setQuotes(shuffled.slice(0, 4));
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Writing",
      description: "Advanced AI generates high-quality content tailored to your specifications and writing style."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Create complete books in minutes, not months. Get from idea to finished product instantly."
    },
    {
      icon: FileText,
      title: "Multiple Formats",
      description: "Export your book in PDF, EPUB, MOBI, and more. Ready for publishing on any platform."
    },
    {
      icon: Shield,
      title: "100% Original",
      description: "Every book is unique and plagiarism-free. Own the complete rights to your content."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Describe Your Book",
      description: "Enter your book idea, genre, target audience, and key themes. The more details, the better."
    },
    {
      step: "02",
      title: "AI Generates Content",
      description: "Our advanced AI creates your book with proper structure, engaging content, and professional formatting."
    },
    {
      step: "03",
      title: "Review & Download",
      description: "Review your generated book, make any edits, and download in your preferred format."
    }
  ];

  const pricing = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for trying out BookGen",
      features: [
        "3 books per month",
        "Up to 5,000 words",
        "PDF export",
        "Community support",
        "Basic templates"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "20",
      description: "For serious authors and creators",
      features: [
        "Unlimited books",
        "Up to 100,000 words",
        "All export formats",
        "Priority support",
        "Commercial license",
        "Advanced customization",
        "API access"
      ],
      popular: true
    }
  ];

  const stats = [
    { label: "Books Generated", value: "50,000+", icon: BookOpen },
    { label: "Happy Authors", value: "10,000+", icon: Users },
    { label: "Success Rate", value: "98%", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated blurry background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Book Generation</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Create Professional Books{" "}
              <span className="gradient-text">with AI</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Transform your ideas into beautifully formatted books in minutes.
              No writing experience needed.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/generate">
                <Button size="default" className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 px-8 h-10">
                  Start Creating
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="default" variant="outline" className="rounded-full px-8 h-10">
                  See How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
            >
              {stats.map((stat, index) => (
                <div key={index} className="glass-card rounded-2xl p-6">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, format, and publish professional books
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card rounded-2xl p-6 h-full hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to your finished book
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <Card className="glass-card rounded-2xl p-8 h-full">
                  <div className="text-6xl font-bold gradient-text mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-purple-600" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`glass-card rounded-2xl p-8 h-full ${plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-medium mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/generate">
                    <Button 
                      className={`w-full rounded-full h-10 ${plan.popular ? 'bg-gradient-to-r from-primary to-purple-600' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes Section */}
      <section id="quotes" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Words of Wisdom
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              What famous people say about knowledge and books
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card rounded-2xl p-6 h-full flex flex-col">
                  <Quote className="w-10 h-10 text-primary/40 mb-4" />
                  <p className="text-base mb-6 flex-grow italic">&ldquo;{quote.text}&rdquo;</p>
                  <div className="border-t border-border/50 pt-4">
                    <div className="font-semibold text-sm">{quote.author}</div>
                    <div className="text-xs text-muted-foreground">{quote.title}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 -z-10" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Your Book?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of authors who have already published their books with BookGen
            </p>
            <Link href="/generate">
              <Button size="default" className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 px-8 h-10">
                Start Creating for Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}