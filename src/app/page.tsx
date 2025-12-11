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
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
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
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[100px] will-change-transform"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[100px] will-change-transform"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[100px] will-change-transform"
        />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              variants={fadeInUp} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 hover:shadow-lg transition-shadow"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">AI-Powered Book Generation</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              Create Professional Books{" "}
              <span className="gradient-text">with AI</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Transform your ideas into beautifully formatted books in minutes.
              No writing experience needed.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            >
              <Link href="/generate">
                <Button 
                  size="default" 
                  className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover:scale-105 transition-all px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl"
                >
                  Start Creating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button 
                  size="default" 
                  variant="outline" 
                  className="rounded-full px-8 h-12 text-base font-semibold hover:scale-105 transition-all"
                >
                  See How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform cursor-default"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <div className="text-4xl font-bold mb-2 gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Powerful Features
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card className="glass-card rounded-2xl p-8 h-full group cursor-default">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Three simple steps to your finished book
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="relative"
              >
                <Card className="glass-card rounded-2xl p-10 h-full group cursor-default">
                  <div className="text-7xl font-bold gradient-text mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-0.5 items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-primary/60" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose the plan that fits your needs. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -8 }}
              >
                <Card className={`glass-card rounded-3xl p-10 h-full relative ${plan.popular ? 'ring-2 ring-primary shadow-2xl md:scale-105' : 'hover:shadow-xl'} transition-all`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-3xl font-bold mb-3 mt-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-6xl font-bold gradient-text">${plan.price}</span>
                    <span className="text-muted-foreground text-lg">/month</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/generate">
                    <Button 
                      className={`w-full rounded-full h-12 text-base font-semibold ${plan.popular ? 'bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg hover:shadow-xl' : ''}`}
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
      <section id="quotes" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Words of Wisdom
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card className="glass-card rounded-2xl p-8 h-full flex flex-col group cursor-default">
                  <Quote className="w-12 h-12 text-primary/40 mb-6 group-hover:text-primary/60 transition-colors" />
                  <p className="text-base mb-6 flex-grow italic leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
                  <div className="border-t border-border/50 pt-4">
                    <div className="font-bold text-base">{quote.author}</div>
                    <div className="text-sm text-muted-foreground mt-1">{quote.title}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-3xl p-16 md:p-20 text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 -z-10 group-hover:from-primary/20 group-hover:to-purple-600/20 transition-all duration-500" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Ready to Create Your Book?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of authors who have already published their books with BookGen
            </p>
            <Link href="/generate">
              <Button 
                size="default" 
                className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover:scale-105 transition-all px-10 h-14 text-lg font-semibold shadow-2xl hover:shadow-primary/50"
              >
                Start Creating for Free
                <ArrowRight className="ml-2 w-5 h-5" />
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