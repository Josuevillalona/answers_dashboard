# **O'Reilly Answers QA Dashboard**

## **Problem**

**O'Reilly collects user feedback on AI-generated answers but has no systematic way to triage, analyze, and act on it—causing quality issues to persist and eroding the "Trusted AI" competitive positioning.**

* **Current state:** Users submit thumbs up/down ratings and written feedback, but this data sits unused in a database with no workflow for Product, Engineering, or Editorial teams to review and address issues systematically.  
* **Operational impact:** PMs spend \~10 hours/week manually querying databases to find patterns. Engineering and Editorial teams have no visibility into priority issues, leading to weeks-long delays in addressing quality problems.  
* **Business impact:** O'Reilly Answers rates 7.2/10 vs competitors at 8.5+/10. With free AI alternatives (ChatGPT, Perplexity) raising user expectations, this quality gap threatens O'Reilly's defensive AI strategy.  
* **Evidence:** Personal testing revealed poor error handling ("Learn" query → "I couldn't help with that" with no follow-up), while market research shows Google, Perplexity, and others have shifted to conversational paradigms that make O'Reilly's approach feel dated.

---

## **Research Methodology & Limitations**

**How I validated this problem:**

* Tested O'Reilly Answers extensively (documented 15+ interactions across different query types)
* Analyzed public reviews (G2, TrustRadius) comparing O'Reilly to competitors
* Reviewed O'Reilly's public statements about their AI strategy and competitive positioning
* Examined competitor feedback systems (ChatGPT, Perplexity, Google AI Overview)
* Researched industry best practices for internal QA dashboards

**What I don't know (and would validate before building):**

1. ❓ Whether PMs actually spend 10 hrs/week on this (estimated from typical data triage workflows in similar products)
2. ❓ Actual feedback volume and quality (assumed ~100/day based on platform size and industry benchmarks)
3. ❓ Internal team priorities (Engineering might want different features than I've spec'd)
4. ❓ Existing tooling (O'Reilly may already have partial solutions or competing initiatives)
5. ❓ Team workflows and handoff processes (assumptions based on typical Product/Eng/Editorial dynamics)

**Validation plan if this were a real project:**

* **Week -2:** Interview 5 PMs, 3 Engineers, 2 Editorial staff about current pain points
* **Week -1:** Shadow PM doing feedback triage for 1 full day to understand actual workflow
* **Week 0:** Review actual feedback data, database schema, and existing internal tools
* **Week 1:** Create mockups → get stakeholder feedback → iterate before writing code

**Note:** This is a portfolio/demo project using mock data. The problem framing is based on research and reasonable assumptions, but would require stakeholder validation before production implementation.

---

## **Vision & Opportunity**

**Transform user feedback from unstructured data into systematic quality improvement by giving Product, Engineering, and Editorial teams a shared dashboard to triage, route, and track resolution of AI answer quality issues.**

**Market Context:**

* O'Reilly's "Trusted AI" strategy depends on execution quality  
* Users trained on ChatGPT/Perplexity expect conversational, accurate AI  
* Each unresolved quality issue accelerates user churn to free alternatives  
* Systematic quality improvement is the competitive moat

**Opportunity:** Enable faster iteration on answer quality (weeks → days), clearer team accountability, and data-driven prioritization—ultimately improving O'Reilly Answers rating from 7.2 → 8.5+ to compete with best-in-class AI assistants.

---

## **Target Use Cases**

1. **As an Associate PM on the AI Team**, I need to quickly review all negative feedback, categorize issues by type (hallucination, outdated content, etc.), and route them to the appropriate team so quality problems don't slip through the cracks.  
2. **As an Engineering Lead**, I need a queue of model-related bugs (hallucinations, wrong context, poor UX) with clear reproduction steps so my team can prioritize and fix issues efficiently.  
3. **As an Editorial Manager**, I need visibility into which source materials are causing AI to give bad answers so I can prioritize content updates that have the highest impact on answer quality.

---

## **Landscape**

**Current O'Reilly Answers Implementation:**

* Users rate answers with 👍/👎 buttons  
* Optional text feedback via "Tell us more" modal  
* Sources cited with each answer  
* Feedback stored in database but no internal tooling exists to act on it

**Competitive Context:**

* **ChatGPT:** Conversational error handling, learns from feedback loops  
* **Perplexity:** Cites sources, iterative questioning  
* **Google AI Overview:** Integrated into search, high visibility  
* **LinkedIn Learning (8.8/10):** Better-rated than O'Reilly Answers (7.2/10)

**Market Shift:** Search is evolving from keyword-based to conversational. Users expect AI that guides them through errors, not dead-ends.

**Why Now:** O'Reilly launched Answers to defend against AI disruption, but execution gaps undermine the strategy. The window to close the quality gap is shrinking as competitors improve and users form habits elsewhere.

---

## **Proposed Solution**

**Build an internal QA Dashboard that centralizes O'Reilly Answers feedback and provides PMs with a systematic workflow to triage, categorize, escalate, and track quality issues.**

### **MVP Scope (Demo Version):**

This demo focuses on **proving the core PM triage workflow** with a single, polished user journey. Team-specific features (Engineering/Editorial dashboards) are scoped for future iterations.

### **Top 3 MVP Value Props:**

1. **Zero feedback falls through cracks** — Every thumbs-down is visible, categorized, and tracked to resolution
2. **80% reduction in PM triage time** — Automated organization replaces manual database queries, freeing PMs for strategic work
3. **Clear escalation workflow** — Issues route to Engineering or Editorial with full context, enabling faster resolution

---

## **Goals**

**Product Goals:**

* Enable 95%+ of feedback to be triaged within 24 hours  
* Reduce PM time on manual feedback analysis from 10 hrs/week → 2 hrs/week  
* Decrease average issue resolution time from weeks → under 7 days  
* Improve O'Reilly Answers rating from 7.2 → 7.8 in 6 months

**Business Goals:**

* Strengthen "Trusted AI" positioning through systematic quality improvement  
* Reduce churn to competing AI platforms  
* Increase user confidence in O'Reilly Answers

### **Non-Goals**

* ❌ **Customer-facing feedback improvements** — This is internal tooling, not user-facing features  
* ❌ **Automatically fixing bad answers** — Dashboard surfaces issues; humans implement fixes  
* ❌ **Other O'Reilly products** — Focused solely on O'Reilly Answers feedback  
* ❌ **Real-time streaming** — V1 uses 5-minute sync intervals (sufficient for triage use case)

---

## **Y1 Success Metrics**

| Goal | Signals | Metrics | Targets |
| ----- | ----- | ----- | ----- |
| **Team Efficiency** | Reduced manual work | PM Time on Manual Triage | 10 hrs/week → 2 hrs/week |
|  | Fast response | Time to First Review | \< 24 hours |
|  | Complete coverage | Feedback Review Coverage | 95%+ triaged |
| **Product Quality** | Improved ratings | O'Reilly Answers Rating | 7.2 → 7.8 (6mo) → 8.5 (12mo) |
|  | Fewer complaints | Thumbs Down Rate | \-30% in 6 months |
|  | Pattern resolution | Top Recurring Issues | Top 5 resolved in 6mo |
| **Process Improvement** | Clear ownership | Issues Escalated | 100% flagged to correct team |
|  | Faster fixes | Average Resolution Time | \< 7 days |

---

## **Conceptual Model**

**Key Entities Users Need to Understand:**

**Feedback Submissions** → User ratings (👍/👎) \+ optional comments on AI answers

**Issue Tags** → Categories like Hallucination, Outdated Content, Wrong Context, Poor UX, Source Misinterpretation

**Escalations** → Routed work items sent to Engineering (model issues) or Editorial (content issues) with priority and context

**Status** → Open (needs work) or Closed (resolved)

**Team Dashboards** → Filtered views showing each team only their relevant issues

---

## **Requirements: Core Triage Workflow (MVP)**

**This MVP focuses on a single, polished user journey: PM triaging daily feedback.** Team-specific dashboards and advanced features are scoped for future versions (see Future Roadmap section).

### **Journey: PM Triages Daily Feedback**

**Viewing Feedback**

* PM can view paginated list of all feedback (50/page, newest first)
* PM can filter by rating (👍/👎), status (Open/Escalated/Closed), date range
* PM can search across query text and user comments
* PM can click any item to open detail view modal

**Detail View & Categorization**

* Modal shows: User query, AI answer, cited sources, timestamp
* PM can tag feedback with issue type (single-select dropdown):
  * Hallucination
  * Outdated Content
  * Wrong Context
  * Poor UX
  * Source Misinterpretation
  * Correct Answer (false negative)
* PM can add internal notes (255 char limit)
* System shows success confirmation when changes are saved
* Primary actions: Save, Escalate, Close

**Escalating to Teams**

* PM clicks "Escalate" button to open two-step modal:
  * **Step 1:** Select team (Engineering or Editorial)
  * **Step 2:** Set priority (Critical/High/Medium/Low) + add summary (100 char)
* PM can add detailed notes (500 char) and suggested action (200 char)
* All original context auto-included: query, answer, sources, PM notes, tags
* System validates required fields before submission
* Success confirmation shown, item status changes to "Escalated"

**Escalations Dashboard**

* Unified view of all escalated items (Engineering and Editorial together)
* Filter by: Team, Priority, Status (Open/Closed)
* Sort by: Priority (Critical first), Date escalated (oldest first)
* Each item shows: Priority badge, team badge, issue summary, issue type, date
* Click to view full details in modal (read-only view of escalation)
* Actions: Mark as Closed (with optional resolution note), Reopen (requires reason)

**Basic Metrics Page**

* Simple count tables (no charts in MVP):
  * Total feedback (7d/30d/90d)
  * Thumbs down rate (%)
  * Top issue categories (count per type)
  * Escalations by team (Engineering vs Editorial)
  * Avg time to resolution (days)
  * Open vs Closed counts
* "Last updated" timestamp visible
* Auto-refresh every 5 minutes
* Clean, readable table layout

---

## **Technical Architecture (Demo Version)**

### **Simplified for Portfolio Demo**

**Data Source:**

* 100% mock data (no real O'Reilly integration)
* Generated via seed script with realistic feedback patterns
* Stored directly in Supabase database

**Tech Stack:**

* Frontend: Next.js 14 + TypeScript + shadcn/ui components
* Backend: Next.js API routes
* Database: Supabase (PostgreSQL)
* Hosting: Vercel
* Auth: Simple email/password (NO SSO for demo)

**Key Design Decisions:**

* ✅ **No real O'Reilly integration** — Don't have access, using mock data
* ✅ **No real-time sync** — Static dataset with realistic timestamps
* ✅ **No SSO complexity** — Simple auth sufficient for demo
* ✅ **Focus on UI/UX polish** — Prioritize clean interface over backend complexity
* ✅ **Separate database** — Demonstrates production-ready architecture pattern

**What Would Change in Production:**

* SSO integration with O'Reilly (Okta/Auth0/SAML)
* Read-only database view from Answers production system
* Automated sync job running every 5 minutes
* Role-based permissions (PMs, Engineering, Editorial)
* Error monitoring (Sentry) and analytics (PostHog/Mixpanel)
* API rate limiting and caching layer

### **Database Schema (Simplified)**

**feedback table:**
* id, query, answer, sources[], rating, user_comment, status, tag, pm_notes, created_at

**escalations table:**
* id, feedback_id, team, priority, summary, details, suggested_action, status, created_at, resolved_at

**Indexes:** status, rating, created_at, team, priority

---

## **Future Roadmap (Post-MVP)**

**This demo focuses on proving the core triage workflow.** If this were a real project, here's what I'd build next based on team feedback and usage data:

### **V2: Team-Specific Views (Weeks 5-8)**

**Features:**
* Engineering dashboard with code/model-focused filtering
* Editorial dashboard with source material grouping and impact metrics
* Team-specific notifications (Slack/email when new escalations arrive)
* Bulk assignment to specific team members

**Validation needed first:**
* Do teams actually want separate dashboards or is unified better?
* What filtering/sorting matters most to each team?
* How do teams currently track work (Jira, Linear, Asana)?

### **V3: Workflow Enhancements (Weeks 9-12)**

**Features:**
* Bulk tagging and escalation for PMs (select multiple items → tag all at once)
* AI-suggested tags using GPT-4 (analyze query + answer → suggest category)
* Duplicate detection using semantic similarity (cluster similar queries)
* Comments/discussion thread on escalations (async team communication)
* Assignment to specific individuals (not just teams)

**Why not in V1:**
* Requires real usage data to prioritize correctly
* Bulk operations need to be designed around actual pain points
* AI tagging needs baseline accuracy testing with real data

### **V4: Integration & Scale (Quarter 2)**

**Features:**
* SSO integration (Okta/Auth0)
* Jira/Linear ticket auto-creation from escalations
* Real-time sync (5min → 30sec polling or webhooks)
* Advanced analytics dashboard with charts and trend analysis
* Export capabilities (CSV, JSON, PDF reports)
* Mobile-responsive optimization

**Why later:**
* Only worth building if MVP proves adoption
* Integration complexity requires dedicated sprint
* Real-time sync adds infrastructure complexity

### **Analytics & Insights (Future)**

**Features:**
* Source material impact analysis ("This Django book causes 15% of negative feedback")
* Query pattern clustering (find emerging topic gaps)
* Feedback sentiment analysis (beyond thumbs up/down)
* A/B test tracking (measure impact of answer quality improvements)
* Executive dashboards (rollup metrics for leadership)

**Depends on:**
* Sufficient data volume (6+ months of feedback)
* Clear business case for advanced analytics
* Data science/ML resources

---

## **Appendix**

### **Open Questions for O'Reilly Engineering**

**Integration:**

1. Does Answers team prefer database view or API for feedback access?  
2. What's the exact schema of existing feedback table?  
3. Which SSO provider does O'Reilly use? (Okta, Auth0, other?)

**Infrastructure:** 4\. Any constraints on using Vercel/Supabase? (compliance, vendor approval) 5\. Internal hosting requirements? (VPN, on-prem, etc.)

**Data Governance:** 6\. Data retention policy for user feedback? 7\. Privacy review needed before accessing feedback data?

### **Demo Build Timeline (3 Weeks)**

**Total effort: ~56 hours over 3 weeks (~19 hrs/week)**

**Week 1: Foundation + List View (18 hours)**
* **Day 1-2:** Next.js setup, Supabase config, deploy to Vercel (4hrs)
* **Day 3-4:** Generate realistic mock data via seed script (50-100 items) (4hrs)
* **Day 5-7:** Feedback list page + filters + search functionality (10hrs)
* **Checkpoint:** ✅ Live URL with working list view and filters

**Week 2: Detail View + Tagging + Escalation (18 hours)**
* **Day 8-10:** Detail modal component + tagging system (8hrs)
* **Day 11-12:** Escalation flow (2-step modal with validation) (6hrs)
* **Day 13-14:** Database persistence, loading states, error handling (4hrs)
* **Checkpoint:** ✅ End-to-end triage workflow functional

**Week 3: Escalations Dashboard + Metrics + Polish (20 hours)**
* **Day 15-17:** Escalations page + filters + close/reopen actions (8hrs)
* **Day 18-19:** Metrics page with simple count tables (4hrs)
* **Day 20-21:** Polish UI, mobile responsive, empty states, final testing (8hrs)
* **Checkpoint:** ✅ Demo-ready product with polished UX

**Success Criteria for Demo:**
* All core workflows functional (view → tag → escalate → resolve)
* Clean, professional UI that looks production-ready
* No obvious bugs during typical demo flow
* Mobile-responsive (in case demoing on tablet/phone)
* Fast load times (<2s for all pages)

---

## **🎯 What Makes a Great Demo**

**What hiring managers need to see in 5 minutes:**

1. **Live feedback list** — Clean UI showing real-looking feedback data
2. **Detail view** — Click into an item, see query + AI answer + sources
3. **Tagging system** — Tag an issue as "Hallucination" or "Outdated Content"
4. **Escalation flow** — Click "Escalate" → choose team → set priority → see confirmation
5. **Escalations dashboard** — Show filtered view with escalated items, ability to resolve

**That's it.** These 5 things prove the concept and demonstrate product + execution skills.

**Demo Script (90 seconds):**
1. "Here's the feedback list - PMs see all user ratings and comments" (15s)
2. "Click to see full context - the query, AI's answer, and cited sources" (15s)
3. "Tag it as a hallucination and add internal notes for the team" (15s)
4. "Escalate to Engineering with priority and context - all automated" (20s)
5. "Engineering sees it in their queue, prioritized by severity, and can resolve it" (15s)
6. "Metrics show we're closing issues faster and improving quality" (10s)

