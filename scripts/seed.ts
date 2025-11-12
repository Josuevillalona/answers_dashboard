import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { FeedbackInsert, EscalationInsert, Source } from '../lib/types/database.types';

// Load environment variables
config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Make sure .env.local exists with:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Realistic O'Reilly queries and answers
const feedbackData = [
  {
    query: "How do JavaScript closures work?",
    answer: "JavaScript closures are functions that have access to variables in their outer (enclosing) lexical scope, even after the outer function has returned. When a function is created, it maintains a reference to its lexical environment.",
    sources: [
      { title: "JavaScript: The Definitive Guide", url: "https://learning.oreilly.com/library/view/javascript-the-definitive/9781491952016/", type: "book" },
      { title: "You Don't Know JS: Scope & Closures", url: "https://learning.oreilly.com/library/view/you-dont-know/9781449335571/", type: "book" }
    ],
    rating: true
  },
  {
    query: "What's the difference between Docker and Kubernetes?",
    answer: "Docker is a containerization platform that packages applications, while Kubernetes is an orchestration system for managing containerized applications at scale.",
    sources: [
      { title: "Docker: Up & Running", url: "https://learning.oreilly.com/library/view/docker-up/9781492036722/", type: "book" }
    ],
    rating: false,
    user_comment: "The answer is too simplistic and doesn't explain when to use each tool",
    tag: "poor_ux" as const
  },
  {
    query: "How do I configure AWS S3 bucket policies?",
    answer: "To configure S3 bucket policies, navigate to the S3 console, select your bucket, and click on the 'Permissions' tab. Then click 'Bucket Policy' and add your JSON policy document.",
    sources: [
      { title: "Amazon Web Services in Action", url: "https://learning.oreilly.com/library/view/amazon-web-services/9781617295119/", type: "book" }
    ],
    rating: false,
    user_comment: "This answer describes the old AWS console UI. The new console has a completely different layout.",
    tag: "outdated_content" as const
  },
  {
    query: "What is the CAP theorem in distributed systems?",
    answer: "The CAP theorem states that a distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition tolerance. MongoDB provides eventual consistency.",
    sources: [
      { title: "Designing Data-Intensive Applications", url: "https://learning.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/", type: "book" }
    ],
    rating: false,
    user_comment: "The MongoDB example is wrong - it actually provides strong consistency in recent versions",
    tag: "hallucination" as const
  },
  {
    query: "How does async/await work in Python?",
    answer: "In Python, async/await allows you to write asynchronous code. The 'async' keyword defines a coroutine function, and 'await' is used to wait for async operations to complete.",
    sources: [
      { title: "Fluent Python", url: "https://learning.oreilly.com/library/view/fluent-python-2nd/9781492056348/", type: "book" }
    ],
    rating: true
  },
  {
    query: "What are React hooks?",
    answer: "React hooks are functions that let you use state and other React features in functional components. The most common hooks are useState, useEffect, and useContext.",
    sources: [
      { title: "Learning React", url: "https://learning.oreilly.com/library/view/learning-react-2nd/9781492051718/", type: "book" }
    ],
    rating: true
  },
  {
    query: "How do I optimize PostgreSQL queries?",
    answer: "To optimize PostgreSQL queries, use EXPLAIN ANALYZE to see query plans, add appropriate indexes, and avoid SELECT *.",
    sources: [
      { title: "High Performance PostgreSQL", url: "https://learning.oreilly.com/library/view/high-performance-postgresql/9781484255834/", type: "book" }
    ],
    rating: false,
    user_comment: "Missing critical info about query statistics and vacuum operations",
    tag: "poor_ux" as const
  },
  {
    query: "What is Git rebase vs merge?",
    answer: "Git rebase moves your commits to a new base, creating a linear history. Git merge combines branches while preserving the branch structure.",
    sources: [
      { title: "Version Control with Git", url: "https://learning.oreilly.com/library/view/version-control-with/9781449345037/", type: "book" }
    ],
    rating: true
  },
  {
    query: "How do I set up SSL certificates with Nginx?",
    answer: "Install certbot, run 'certbot --nginx' to automatically configure SSL for your Nginx server.",
    sources: [
      { title: "Nginx Cookbook", url: "https://learning.oreilly.com/library/view/nginx-cookbook/9781492049098/", type: "book" }
    ],
    rating: false,
    user_comment: "Doesn't mention certificate renewal or troubleshooting common errors",
    tag: "poor_ux" as const
  },
  {
    query: "What is the difference between REST and GraphQL?",
    answer: "REST uses fixed endpoints for each resource, while GraphQL allows clients to request exactly the data they need through a single endpoint.",
    sources: [
      { title: "Learning GraphQL", url: "https://learning.oreilly.com/library/view/learning-graphql/9781492030706/", type: "book" }
    ],
    rating: true
  },
  {
    query: "How do I implement OAuth2 authentication?",
    answer: "OAuth2 uses authorization codes to grant access. First, redirect users to the provider's auth page, then exchange the code for an access token.",
    sources: [
      { title: "OAuth 2 in Action", url: "https://learning.oreilly.com/library/view/oauth-2-in/9781617293276/", type: "book" }
    ],
    rating: false,
    user_comment: "Missing critical security considerations like PKCE and state parameters",
    tag: "wrong_context" as const
  },
  {
    query: "What are TypeScript generics?",
    answer: "TypeScript generics allow you to create reusable components that work with multiple types while maintaining type safety.",
    sources: [
      { title: "Programming TypeScript", url: "https://learning.oreilly.com/library/view/programming-typescript/9781492037644/", type: "book" }
    ],
    rating: true
  },
  {
    query: "How does Redis persistence work?",
    answer: "Redis offers two persistence options: RDB snapshots and AOF (Append-Only File) logs. You can use both together for maximum data safety.",
    sources: [
      { title: "Redis in Action", url: "https://learning.oreilly.com/library/view/redis-in-action/9781617290855/", type: "book" }
    ],
    rating: true
  },
  {
    query: "What is the difference between TCP and UDP?",
    answer: "TCP provides reliable, ordered delivery with error checking. UDP is faster but doesn't guarantee delivery or order.",
    sources: [
      { title: "Computer Networking: A Top-Down Approach", url: "https://learning.oreilly.com/library/view/computer-networking-a/9780133594140/", type: "book" }
    ],
    rating: true
  },
  {
    query: "How do I use Jenkins for CI/CD?",
    answer: "Jenkins automates building, testing, and deploying code. Create a Jenkinsfile to define your pipeline stages.",
    sources: [
      { title: "Jenkins: The Definitive Guide", url: "https://learning.oreilly.com/library/view/jenkins-the-definitive/9781449311155/", type: "book" }
    ],
    rating: false,
    user_comment: "Book reference is from 2011 - Jenkins has changed drastically since then",
    tag: "outdated_content" as const
  },
  {
    query: "What are Python decorators?",
    answer: "Decorators are functions that modify the behavior of other functions. They use the @decorator syntax.",
    sources: [
      { title: "Python Cookbook", url: "https://learning.oreilly.com/library/view/python-cookbook-3rd/9781449357337/", type: "book" }
    ],
    rating: true
  },
  {
    query: "How does DNS resolution work?",
    answer: "DNS resolves domain names to IP addresses through a hierarchical system of DNS servers, starting from root servers.",
    sources: [
      { title: "DNS and BIND", url: "https://learning.oreilly.com/library/view/dns-and-bind/0596100574/", type: "book" }
    ],
    rating: true
  },
  {
    query: "What is event-driven architecture?",
    answer: "Event-driven architecture uses events to trigger and communicate between decoupled services.",
    sources: [
      { title: "Building Event-Driven Microservices", url: "https://learning.oreilly.com/library/view/building-event-driven-microservices/9781492057888/", type: "book" }
    ],
    rating: true
  },
  {
    query: "How do I optimize React performance?",
    answer: "Use React.memo for component memoization, useMemo for expensive calculations, and useCallback for function references.",
    sources: [
      { title: "React Performance Optimization", url: "https://learning.oreilly.com/library/view/react-performance/9781803241760/", type: "book" }
    ],
    rating: false,
    user_comment: "Doesn't mention code splitting or lazy loading which are more impactful",
    tag: "poor_ux" as const
  },
  {
    query: "What is Terraform used for?",
    answer: "Terraform is infrastructure as code (IaC) tool for provisioning and managing cloud resources declaratively.",
    sources: [
      { title: "Terraform: Up & Running", url: "https://learning.oreilly.com/library/view/terraform-up/9781492046905/", type: "book" }
    ],
    rating: true
  },
];

// Additional negative feedback examples
const negativeFeedback = [
  {
    query: "How do I debug memory leaks in Node.js?",
    answer: "Use the Chrome DevTools memory profiler to find memory leaks.",
    sources: [{ title: "Node.js Design Patterns", url: "https://learning.oreilly.com/library/view/nodejs-design/9781839214110/", type: "book" }],
    rating: false,
    user_comment: "Chrome DevTools doesn't work with Node.js. You need node --inspect.",
    tag: "hallucination" as const
  },
  {
    query: "What are SOLID principles?",
    answer: "SOLID is an acronym for five design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
    sources: [{ title: "Clean Code", url: "https://learning.oreilly.com/library/view/clean-code/9780136083238/", type: "book" }],
    rating: false,
    user_comment: "Correct definition but missing practical examples - not helpful",
    tag: "poor_ux" as const
  },
  {
    query: "How does blockchain consensus work?",
    answer: "Blockchain uses proof-of-work where miners solve complex mathematical puzzles to validate transactions.",
    sources: [{ title: "Mastering Bitcoin", url: "https://learning.oreilly.com/library/view/mastering-bitcoin/9781491954379/", type: "book" }],
    rating: false,
    user_comment: "Only mentions PoW, ignoring PoS and other consensus mechanisms",
    tag: "wrong_context" as const
  },
  {
    query: "What is the difference between SQL and NoSQL?",
    answer: "SQL databases use tables and relationships, NoSQL databases use documents or key-value pairs.",
    sources: [{ title: "Seven Databases in Seven Weeks", url: "https://learning.oreilly.com/library/view/seven-databases/9781680505962/", type: "book" }],
    rating: false,
    user_comment: "Oversimplified - doesn't discuss use cases or trade-offs",
    tag: "poor_ux" as const
  },
];

async function seed() {
  console.log('🌱 Starting seed process...\n');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await supabase.from('escalations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('feedback').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleared existing data\n');

    // Combine all feedback
    const allFeedback = [...feedbackData, ...negativeFeedback];

    // Generate timestamps spread over last 90 days
    const now = new Date();
    const feedbackToInsert: FeedbackInsert[] = allFeedback.map((item, index) => {
      const daysAgo = Math.floor((index / allFeedback.length) * 90);
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(Math.floor(Math.random() * 24));
      createdAt.setMinutes(Math.floor(Math.random() * 60));

      return {
        query: item.query,
        answer: item.answer,
        sources: item.sources as Source[],
        rating: item.rating,
        user_comment: item.user_comment || null,
        status: item.tag ? ('open' as const) : ('open' as const),
        tag: item.tag || null,
        pm_notes: null,
        created_at: createdAt.toISOString(),
      };
    });

    // Insert feedback
    console.log(`📝 Inserting ${feedbackToInsert.length} feedback items...`);
    const { data: insertedFeedback, error: feedbackError } = await supabase
      .from('feedback')
      .insert(feedbackToInsert)
      .select();

    if (feedbackError) {
      console.error('❌ Error inserting feedback:', feedbackError);
      throw feedbackError;
    }

    console.log(`✅ Inserted ${insertedFeedback?.length} feedback items\n`);

    // Create some escalations from negative feedback
    const escalationsToCreate = insertedFeedback
      ?.filter(f => f.tag && f.rating === false)
      .slice(0, 12); // Create 12 escalations

    if (escalationsToCreate && escalationsToCreate.length > 0) {
      const escalationsData: EscalationInsert[] = escalationsToCreate.map((feedback, index) => {
        const teams: Array<'engineering' | 'editorial'> = ['engineering', 'editorial'];
        const priorities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];

        const team = teams[index % 2];
        const priority = priorities[index % 4];
        const isResolved = index < 5; // Resolve first 5

        const summaries: Record<string, string> = {
          hallucination: 'AI providing incorrect factual information',
          outdated_content: 'Content references are out of date',
          wrong_context: 'Answer missing critical context',
          poor_ux: 'Answer quality needs improvement',
          source_misinterpretation: 'Sources cited incorrectly',
          correct_answer: 'False negative - answer was correct'
        };

        const details: Record<string, string> = {
          hallucination: 'The AI is making factually incorrect statements that could mislead users. Need to review training data and model outputs.',
          outdated_content: 'Referenced books or documentation are outdated. Need to update source material or add version filtering.',
          wrong_context: 'Answer is missing important context that would make it actionable for users.',
          poor_ux: 'While technically correct, the answer doesn\'t provide enough detail to be useful.',
          source_misinterpretation: 'The sources are cited but the information extracted is incorrect.',
          correct_answer: 'User marked as negative but answer appears correct. May need user education.'
        };

        const createdAt = new Date(feedback.created_at);
        createdAt.setHours(createdAt.getHours() + 2); // Escalated 2 hours after feedback

        return {
          feedback_id: feedback.id,
          team,
          priority,
          summary: summaries[feedback.tag!],
          details: details[feedback.tag!],
          suggested_action: team === 'engineering'
            ? 'Review model output and add validation rules'
            : 'Update source material and verify citations',
          status: isResolved ? ('closed' as const) : ('open' as const),
          resolution_notes: isResolved ? 'Fixed in latest model update' : null,
          created_at: createdAt.toISOString(),
          resolved_at: isResolved
            ? new Date(createdAt.getTime() + (Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
            : null,
        };
      });

      console.log(`🚨 Creating ${escalationsData.length} escalations...`);
      const { data: insertedEscalations, error: escalationsError } = await supabase
        .from('escalations')
        .insert(escalationsData)
        .select();

      if (escalationsError) {
        console.error('❌ Error inserting escalations:', escalationsError);
        throw escalationsError;
      }

      console.log(`✅ Created ${insertedEscalations?.length} escalations\n`);

      // Update feedback status for escalated items
      const escalatedIds = escalationsData.map(e => e.feedback_id);
      await supabase
        .from('feedback')
        .update({ status: 'escalated' as const })
        .in('id', escalatedIds);

      console.log(`✅ Updated feedback status for escalated items\n`);
    }

    console.log('✨ Seed completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   • Total feedback: ${insertedFeedback?.length}`);
    console.log(`   • Thumbs up: ${insertedFeedback?.filter(f => f.rating).length}`);
    console.log(`   • Thumbs down: ${insertedFeedback?.filter(f => !f.rating).length}`);
    console.log(`   • Escalations: ${escalationsToCreate?.length || 0}`);
    console.log(`   • Resolved: 5`);
    console.log(`   • Open escalations: ${(escalationsToCreate?.length || 0) - 5}\n`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
