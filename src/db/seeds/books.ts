import { db } from '@/db';
import { books } from '@/db/schema';

async function main() {
    const sampleBooks = [
        {
            userId: 'test-user-001',
            title: 'The Last Horizon',
            genre: 'Fiction',
            audience: 'Adult',
            description: 'A gripping tale of survival and hope in a post-apocalyptic world where humanity must rebuild from the ashes.',
            tone: 'Dramatic',
            style: 'Descriptive',
            chapters: 15,
            wordsPerChapter: 3000,
            totalWords: 45000,
            status: 'completed',
            content: JSON.stringify({
                chapters: [
                    {
                        number: 1,
                        title: 'The Beginning of the End',
                        content: 'The sky turned crimson as the final warning sirens echoed through the empty streets. Sarah clutched her survival pack and ran toward the bunker, knowing this would be the last time she saw her city standing. The dramatic tension of survival began here.'
                    },
                    {
                        number: 2,
                        title: 'Underground Sanctuary',
                        content: 'Deep beneath the rubble, survivors gathered in makeshift communities. The descriptive details of their new underground world painted a picture of resilience and adaptation. Hope flickered in the darkness like candles in the night.'
                    },
                    {
                        number: 3,
                        title: 'First Light',
                        content: 'Months later, the first brave souls ventured to the surface. What they found was both terrifying and beautiful - a world reborn in ways they never imagined. The dramatic journey of rebuilding humanity had truly begun.'
                    }
                ]
            }),
            coverUrl: null,
            createdAt: new Date('2024-11-15').toISOString(),
            updatedAt: new Date('2024-11-15').toISOString(),
        },
        {
            userId: 'test-user-001',
            title: 'The Startup Blueprint',
            genre: 'Business',
            audience: 'Entrepreneurs',
            description: 'A comprehensive guide to building a successful startup from idea to IPO, with real-world case studies and actionable strategies.',
            tone: 'Professional',
            style: 'Instructional',
            chapters: 12,
            wordsPerChapter: 2500,
            totalWords: 30000,
            status: 'completed',
            content: JSON.stringify({
                chapters: [
                    {
                        number: 1,
                        title: 'Finding Your Big Idea',
                        content: 'Every successful startup begins with a problem worth solving. This instructional guide for entrepreneurs walks you through validating your business idea using professional frameworks and market research techniques.'
                    },
                    {
                        number: 2,
                        title: 'Building Your MVP',
                        content: 'Learn the professional approach to creating a minimum viable product. This chapter provides instructional guidance on lean development, user testing, and iterative improvement strategies used by successful entrepreneurs.'
                    },
                    {
                        number: 3,
                        title: 'Securing Funding',
                        content: 'Navigate the complex world of startup funding with professional insights. From bootstrapping to venture capital, this instructional content helps entrepreneurs understand their options and craft compelling pitches.'
                    },
                    {
                        number: 4,
                        title: 'Scaling Your Business',
                        content: 'Professional strategies for growing your startup sustainably. This instructional chapter covers hiring, operations, and maintaining company culture as you scale from startup to established business.'
                    }
                ]
            }),
            coverUrl: null,
            createdAt: new Date('2024-11-20').toISOString(),
            updatedAt: new Date('2024-11-20').toISOString(),
        },
        {
            userId: 'test-user-001',
            title: 'Chronicles of the Shadow Realm',
            genre: 'Fantasy',
            audience: 'Young Adult',
            description: 'An epic fantasy adventure following a young mage\'s quest to save her kingdom from an ancient evil that threatens to consume all magic.',
            tone: 'Epic',
            style: 'Narrative',
            chapters: 20,
            wordsPerChapter: 4000,
            totalWords: 80000,
            status: 'completed',
            content: JSON.stringify({
                chapters: [
                    {
                        number: 1,
                        title: 'The Awakening',
                        content: 'Aria discovered her magical abilities on her sixteenth birthday when shadows began to dance at her fingertips. This epic narrative for young adults begins as she learns of her destiny to save the realm from the Shadow King.'
                    },
                    {
                        number: 2,
                        title: 'The Academy of Arcane Arts',
                        content: 'At the legendary academy, Aria trained alongside other young mages. The epic narrative unfolds as she masters ancient spells and forms bonds with fellow students who would become her companions in the battle ahead.'
                    },
                    {
                        number: 3,
                        title: 'The Prophecy Revealed',
                        content: 'Ancient texts spoke of a young mage who would either save or doom the Shadow Realm. This epic fantasy narrative for young adults deepens as Aria uncovers the truth about her connection to the Shadow King.'
                    },
                    {
                        number: 4,
                        title: 'Journey Through the Dark Forest',
                        content: 'Aria and her companions ventured into the forbidden Dark Forest, where corrupted magic twisted reality itself. The epic narrative style brings to life their harrowing journey toward the Shadow King\'s fortress.'
                    }
                ]
            }),
            coverUrl: null,
            createdAt: new Date('2024-11-25').toISOString(),
            updatedAt: new Date('2024-11-25').toISOString(),
        },
        {
            userId: 'test-user-001',
            title: 'Mindful Living: A Guide to Inner Peace',
            genre: 'Self-Help',
            audience: 'General',
            description: 'Practical techniques and mindfulness exercises to reduce stress, increase happiness, and live a more fulfilling life.',
            tone: 'Encouraging',
            style: 'Conversational',
            chapters: 10,
            wordsPerChapter: 2000,
            totalWords: 20000,
            status: 'completed',
            content: JSON.stringify({
                chapters: [
                    {
                        number: 1,
                        title: 'Understanding Mindfulness',
                        content: 'Welcome to your journey toward inner peace. In this encouraging, conversational guide for general audiences, we explore what mindfulness truly means and how it can transform your daily life through simple, practical techniques.'
                    },
                    {
                        number: 2,
                        title: 'Breathing Techniques for Calm',
                        content: 'Your breath is your most powerful tool for finding peace. This conversational chapter offers encouraging exercises that anyone can practice. Learn simple breathing techniques that reduce stress and bring clarity in moments of chaos.'
                    },
                    {
                        number: 3,
                        title: 'Creating Your Daily Practice',
                        content: 'Building a sustainable mindfulness practice takes patience and self-compassion. In this encouraging, conversational style, we discuss practical ways to integrate mindfulness into your busy life, making it accessible for everyone.'
                    },
                    {
                        number: 4,
                        title: 'Overcoming Mental Clutter',
                        content: 'Your mind is not your enemy - it just needs gentle guidance. This encouraging self-help chapter provides conversational, practical strategies for managing racing thoughts and finding mental clarity in our chaotic modern world.'
                    }
                ]
            }),
            coverUrl: null,
            createdAt: new Date('2024-12-01').toISOString(),
            updatedAt: new Date('2024-12-01').toISOString(),
        },
        {
            userId: 'test-user-001',
            title: 'AI Revolution: Understanding Machine Learning',
            genre: 'Technology',
            audience: 'Tech Professionals',
            description: 'A deep dive into artificial intelligence and machine learning, covering algorithms, applications, and ethical considerations.',
            tone: 'Technical',
            style: 'Academic',
            chapters: 18,
            wordsPerChapter: 3500,
            totalWords: 63000,
            status: 'completed',
            content: JSON.stringify({
                chapters: [
                    {
                        number: 1,
                        title: 'Introduction to Machine Learning',
                        content: 'Machine learning represents a paradigm shift in computational problem-solving. This academic, technical exploration for tech professionals examines the fundamental principles underlying modern AI systems and their mathematical foundations.'
                    },
                    {
                        number: 2,
                        title: 'Neural Networks and Deep Learning',
                        content: 'Neural networks mirror biological learning processes through mathematical abstractions. In this technical, academic style, we analyze network architectures, backpropagation algorithms, and optimization techniques used by professionals in the field.'
                    },
                    {
                        number: 3,
                        title: 'Supervised Learning Algorithms',
                        content: 'Supervised learning forms the backbone of many production ML systems. This academic technology chapter provides technical analysis of regression, classification, and ensemble methods for tech professionals building real-world applications.'
                    },
                    {
                        number: 4,
                        title: 'Unsupervised Learning and Clustering',
                        content: 'Pattern discovery without labeled data requires sophisticated algorithms. In technical, academic style, we examine clustering techniques, dimensionality reduction, and anomaly detection methods used by tech professionals in data science.'
                    }
                ]
            }),
            coverUrl: null,
            createdAt: new Date('2024-12-05').toISOString(),
            updatedAt: new Date('2024-12-05').toISOString(),
        },
        {
            userId: 'test-user-001',
            title: 'Love in the Time of Code',
            genre: 'Romance',
            audience: 'Adult',
            description: 'A modern romance set in Silicon Valley where two software engineers find love while building a revolutionary app.',
            tone: 'Romantic',
            style: 'Emotional',
            chapters: 14,
            wordsPerChapter: 2800,
            totalWords: 39200,
            status: 'completed',
            content: JSON.stringify({
                chapters: [
                    {
                        number: 1,
                        title: 'Debug My Heart',
                        content: 'Maya debugged code better than she navigated relationships. When Alex joined her startup team, their chemistry was undeniable. This romantic, emotional narrative for adults explores how two engineers found love in late-night coding sessions.'
                    },
                    {
                        number: 2,
                        title: 'Merging Branches',
                        content: 'Their code reviews became increasingly personal, and pull requests came with subtle flirtations. This emotional romance for adult readers captures the romantic tension building between Maya and Alex as they collaborated on revolutionary features.'
                    },
                    {
                        number: 3,
                        title: 'Syntax Errors of the Heart',
                        content: 'When a critical bug threatened their launch, Maya and Alex worked through the night. In this romantic, emotional style, their professional partnership deepened into something more as vulnerability broke down carefully constructed walls.'
                    },
                    {
                        number: 4,
                        title: 'Deploying Love',
                        content: 'On launch night, with their app successfully deployed, Alex finally confessed his feelings. This emotional romance for adults culminates as Maya realizes that the most revolutionary thing they built together was their relationship.'
                    }
                ]
            }),
            coverUrl: null,
            createdAt: new Date('2024-12-10').toISOString(),
            updatedAt: new Date('2024-12-10').toISOString(),
        }
    ];

    await db.insert(books).values(sampleBooks);
    
    console.log('✅ Books seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});