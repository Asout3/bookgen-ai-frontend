// AI Book Generation Engine - Adapted for Next.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-2.0-flash-exp';

let genAI: GoogleGenerativeAI | null = null;

function ensureGenAI() {
  if (genAI) return genAI;
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set in environment.');
  }
  genAI = new GoogleGenerativeAI(key);
  return genAI;
}

class RateLimiter {
  private requests: number[] = [];
  private requestsPerMinute: number;

  constructor(requestsPerMinute: number) {
    this.requestsPerMinute = requestsPerMinute;
  }

  async wait() {
    const now = Date.now();
    this.requests = this.requests.filter(t => now - t < 60000);
    
    while (this.requests.length >= this.requestsPerMinute) {
      const oldest = this.requests[0];
      const waitTime = 60000 - (now - oldest) + 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requests.push(Date.now());
  }
}

const globalRateLimiter = new RateLimiter(15);

function cleanUpAIText(text: string): string {
  if (!text) return '';
  
  let clean = text
    .replace(/^(?:Hi|Hello|Hey|Sure|Here).*?(\n\n|$)/gis, '')
    .replace(/^\s*Table of Contents\s*$/gim, '')
    .replace(/(\d+)([a-zA-Z]+)/g, '$1 $2')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\*\s*$/gm, '')
    .trim();
    
  return clean;
}

function parseTOC(tocContent: string): Array<{ title: string; subtopics: string[] }> {
  const lines = tocContent.split('\n').map(l => l.trimEnd()).filter(l => l.trim());
  const chapters: Array<{ title: string; subtopics: string[] }> = [];
  let current: { title: string; subtopics: string[] } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (!line) continue;
    
    const chapMatch = line.match(/^Chapter\s+\d+:\s*(.+)$/i) || line.match(/^(?:\d+[\.\):]|\d+\s+|[-\*•])\s*(.+)$/i);
    
    if (chapMatch && !line.startsWith(' -') && !line.match(/^[\s]*[-•*·]/)) {
      let title = chapMatch[1].trim().replace(/[:–—*]\s*$/, '').replace(/^\d+\.\s*/, '');
      if (title && title.length > 10) {
        if (current) chapters.push(current);
        current = { title, subtopics: [] };
      }
    } else if (current && line.match(/^[\s]*[-•*·]\s+(.+)$/)) {
      const sub = line.match(/^[\s]*[-•*·]\s+(.+)$/)![1].trim();
      if (sub.length > 5) {
        current.subtopics.push(sub);
      }
    }
  }
  
  if (current) chapters.push(current);
  return chapters.filter(c => c.subtopics.length >= 3);
}

function generateFallbackTOC(bookTopic: string, numChapters: number): Array<{ title: string; subtopics: string[] }> {
  const cleanTopic = bookTopic.replace(/\bin\s+.*$/i, '').trim();
  const baseTopics = [
    "Introduction to Core Concepts",
    "Essential Principles",
    "Understanding Key Systems",
    "Practical Applications",
    "Advanced Topics and Trends",
    "Deeper Exploration",
    "Case Studies and Examples",
    "Best Practices",
    "Common Challenges and Solutions",
    "Implementation Strategies",
    "Advanced Techniques",
    "Future Perspectives",
    "Expert Insights",
    "Real-World Applications",
    "Comprehensive Review"
  ];
  
  const chapters = baseTopics.slice(0, numChapters).map((t) => ({
    title: `${t}`,
    subtopics: [
      "Understanding the core concept",
      "Practical applications",
      "Common challenges",
      "Best practices"
    ]
  }));
  
  return chapters;
}

async function askAI(prompt: string, options: { maxOutputTokens?: number; temperature?: number } = {}): Promise<string> {
  await globalRateLimiter.wait();
  
  const genCfg = {
    maxOutputTokens: options.maxOutputTokens || 4000,
    temperature: options.temperature || 0.7,
    topP: 0.9
  };
  
  const model = ensureGenAI().getGenerativeModel({ 
    model: MODEL_NAME, 
    generationConfig: genCfg 
  });
  
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      let reply = '';
      
      if (result.response && typeof result.response.text === 'function') {
        reply = await result.response.text();
      } else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        reply = result.candidates[0].content.parts[0].text;
      }
      
      reply = (reply || '').toString().trim();
      
      if (!reply || reply.length < 50) {
        if (attempt < 2) await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      
      return reply;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
    }
  }
  
  throw new Error('Failed to get AI response after 3 attempts');
}

async function generateTOC(bookTopic: string, numChapters: number, onProgress?: (progress: number, message: string) => void): Promise<Array<{ title: string; subtopics: string[] }>> {
  if (onProgress) onProgress(5, 'Creating table of contents...');
  
  const prompt = `Create a detailed table of contents for a book about "${bookTopic}".
REQUIREMENTS (FOLLOW EXACTLY):
- Output EXACTLY ${numChapters} chapters
- Use the format: "Chapter X: Title" on its own line
- Follow each chapter title with 3-5 subtopics, each on its own line, indented with 3 spaces and a dash: " - Subtopic"
- NO extra text`;

  for (let attempts = 0; attempts < 5; attempts++) {
    try {
      const rawTOC = await askAI(prompt, { maxOutputTokens: 1500 });
      const cleaned = cleanUpAIText(rawTOC);
      const parsed = parseTOC(cleaned);
      
      if (parsed.length >= numChapters - 1 && parsed.every(c => c.subtopics.length >= 3)) {
        return parsed.slice(0, numChapters);
      }
    } catch (e) {
      console.error('TOC generation error:', e);
    }
  }
  
  return generateFallbackTOC(bookTopic, numChapters);
}

async function generateChapter(
  bookTopic: string, 
  chapterNumber: number, 
  chapterInfo: { title: string; subtopics: string[] },
  wordsPerChapter: number
): Promise<string> {
  const subtopicList = chapterInfo.subtopics.map(s => `- ${s}`).join('\n');
  
  const prompt = `Write Chapter ${chapterNumber}: "${chapterInfo.title}" for a book about "${bookTopic}".

CRITICAL FORMATTING RULES:
- Start with EXACTLY ONE heading: "## ${chapterInfo.title}"
- Do NOT repeat the title as a second heading
- Use ### for ALL subsections
- Target ${wordsPerChapter}+ words total
- Professional, engaging writing style

MANDATORY STRUCTURE:
1) Introduction: Overview of the chapter
2) SECTIONS: Create a subsection (###) for EACH subtopic:
${subtopicList}
3) Practical Application: Real-world example
4) Summary: Key takeaways

Output ONLY the chapter content.`;

  return cleanUpAIText(await askAI(prompt, {
    maxOutputTokens: Math.min(8000, wordsPerChapter * 2),
    temperature: 0.6
  }));
}

async function generateConclusion(bookTopic: string, chapterInfos: Array<{ title: string }>): Promise<string> {
  const titles = chapterInfos.map(c => c.title).join(', ');
  const prompt = `Write a professional conclusion for a book about "${bookTopic}". 
Summarize the key themes covered in these chapters: ${titles}. 
Write approximately 500-800 words.`;
  
  return cleanUpAIText(await askAI(prompt, { maxOutputTokens: 2000 }));
}

export interface BookGenerationOptions {
  title: string;
  topic: string;
  genre: string;
  audience: string;
  description: string;
  tone: string;
  style: string;
  bookLength: 'short' | 'mid' | 'long';
  onProgress?: (progress: number, message: string) => void;
}

export interface GeneratedBook {
  title: string;
  topic: string;
  tableOfContents: Array<{ title: string; subtopics: string[] }>;
  chapters: string[];
  conclusion: string;
  metadata: {
    genre: string;
    audience: string;
    description: string;
    tone: string;
    style: string;
    totalChapters: number;
    estimatedWords: number;
  };
}

export async function generateBook(options: BookGenerationOptions): Promise<GeneratedBook> {
  const { title, topic, genre, audience, description, tone, style, bookLength, onProgress } = options;
  
  // Determine chapters based on book length
  const chapterConfig = {
    short: { chapters: 5, wordsPerChapter: 1500 },
    mid: { chapters: 10, wordsPerChapter: 2000 },
    long: { chapters: 15, wordsPerChapter: 2500 }
  };
  
  const config = chapterConfig[bookLength];
  
  if (onProgress) onProgress(0, 'Starting book generation...');
  
  // Generate Table of Contents
  if (onProgress) onProgress(5, 'Creating table of contents...');
  const tableOfContents = await generateTOC(topic, config.chapters, onProgress);
  
  if (onProgress) onProgress(15, 'Table of contents created!');
  
  // Generate Chapters
  const chapters: string[] = [];
  const progressPerChapter = 70 / config.chapters;
  
  for (let i = 0; i < tableOfContents.length; i++) {
    const chapterNumber = i + 1;
    const chapterInfo = tableOfContents[i];
    
    if (onProgress) {
      onProgress(
        Math.round(15 + (i * progressPerChapter)),
        `Writing Chapter ${chapterNumber}: ${chapterInfo.title}...`
      );
    }
    
    const chapterContent = await generateChapter(
      topic,
      chapterNumber,
      chapterInfo,
      config.wordsPerChapter
    );
    
    chapters.push(`# Chapter ${chapterNumber}: ${chapterInfo.title}\n\n${chapterContent}`);
  }
  
  if (onProgress) onProgress(85, 'Chapters complete! Writing conclusion...');
  
  // Generate Conclusion
  const conclusion = await generateConclusion(topic, tableOfContents);
  
  if (onProgress) onProgress(95, 'Finalizing your book...');
  
  const book: GeneratedBook = {
    title,
    topic,
    tableOfContents,
    chapters,
    conclusion: `# Conclusion\n\n${conclusion}`,
    metadata: {
      genre,
      audience,
      description,
      tone,
      style,
      totalChapters: config.chapters,
      estimatedWords: config.chapters * config.wordsPerChapter
    }
  };
  
  if (onProgress) onProgress(100, 'Book generation complete!');
  
  return book;
}

export function bookToMarkdown(book: GeneratedBook): string {
  let markdown = `# ${book.title}\n\n`;
  markdown += `**Genre:** ${book.metadata.genre}\n`;
  markdown += `**Audience:** ${book.metadata.audience}\n`;
  markdown += `**Tone:** ${book.metadata.tone}\n`;
  markdown += `**Style:** ${book.metadata.style}\n\n`;
  markdown += `---\n\n`;
  markdown += `## Table of Contents\n\n`;
  
  book.tableOfContents.forEach((chapter, i) => {
    markdown += `${i + 1}. ${chapter.title}\n`;
    chapter.subtopics.forEach(sub => {
      markdown += `   - ${sub}\n`;
    });
  });
  
  markdown += `\n---\n\n`;
  
  book.chapters.forEach(chapter => {
    markdown += `${chapter}\n\n---\n\n`;
  });
  
  markdown += book.conclusion;
  
  return markdown;
}
