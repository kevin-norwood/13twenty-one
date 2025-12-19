# AI Services - Summarizer Microservice

A TypeScript-based microservice built with Next.js that provides intelligent data summarization using Anthropic's Claude AI. This service integrates with both PostgreSQL and MySQL databases to summarize any grouping of data, with support for both automatic triggering via database events and manual API requests.

## Overview

**Goal**: Provide intelligent summaries of any grouping of data in a given database. Summaries can be re-calculated automatically (via database triggers) or manually through API requests.

**Use Cases**:
- Candidate review summaries linked with events/jobs/interviews
- Admin notes summarization
- Contextual data aggregation for enhanced AI analysis

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API Endpoints

### POST /summarize
Trigger summarization of provided data using Claude AI.

**Request Body** (Data Contract TBD):
```json
{
  "data": []
}
```

### GET /getSummary
Retrieve previously generated summaries (for demo purposes).

**Response** (Data Contract TBD)

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│                  (UI/Frontend Display)                       │
└─────────────────────────────────────────────────────────────┘
                            ↑
                    store_summary
                            ↑
┌─────────────────────────────────────────────────────────────┐
│              Summarizer Microservice                         │
│           (TypeScript/Next.js Web Server)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  POST /summarize  │  GET /getSummary                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↑                                      ↓
    get_summary                        Claude API (Anthropic)
         ↑                                      ↓
┌─────────────────────────────────────────────────────────────┐
│             Database & Trigger Layer                         │
│  ┌────────────────┐              ┌────────────────────┐    │
│  │     MySQL      │              │     PostgreSQL     │    │
│  │   ADMINNOTES   │  ←triggers→  │  NOTES_SUMMARY     │    │
│  │ get_notes()    │              │ note_created_      │    │
│  │ store_summary()│              │ trigger()          │    │
│  └────────────────┘              └────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Trigger Mechanism

- **Automatic**: Database triggers fire when ADMINNOTES records are updated/stored
- **Manual**: API endpoint can trigger summarization on demand
- Integration with Spring Microservice for backend operations

## Tech Stack

### Backend & Web Server
- **Runtime**: TypeScript
- **Framework**: Next.js
- **Server Type**: Web Server (HTTP/API-based)

### APIs & AI
- **AI Provider**: Anthropic (Claude)
- **API Endpoints**:
  - POST /summarize
  - GET /getSummary (for demo)

### Data Layer
- **Primary Database**: PostgreSQL
  - Table: `NOTES_SUMMARY` (stores summarized data)
- **Secondary Database**: MySQL
  - Table: `ADMINNOTES` (source data)
- **ORM**: Drizzle
- **Trigger Integration**: Database triggers from both PostgreSQL and MySQL

### Additional Services
- Spring Microservice (backend processing)
- ORM: Drizzle

## Implementation Phases

### Phase One: Core Implementation

**Steps**:
1. Trigger the 'summarizer' (via button or database trigger)
2. Send input data to 'summarizer' service via HTTP POST:
   ```json
   {
     "data": []
   }
   ```
3. Process input data and send to Claude API
4. Save summarized output to PostgreSQL database
5. Surface summarized data in application UI

### Phase Two: Testing
- Gather and validate input data
- Test automatic and manual trigger flows
- Validate data accuracy and quality

## Key Features

### Core Features
- **Multi-source data summarization**: Accepts data from any table source (PostgreSQL/MySQL)
- **Dual-trigger support**: Automatic via database triggers or manual via API
- **AI-powered**: Uses Anthropic's Claude for intelligent summarization
- **Persistent storage**: Saves summaries to PostgreSQL for retrieval

### Nice-to-Have Features
- **Plug & Play context documents**: Swap different contextual settings for various summarization goals
- **Linked data context**: Include related events/jobs/interviews to improve summary quality (e.g., for candidate reviews)
- **Configurable data relationships**: Settings that define which data tables to link for enhanced context windows

## Plug & Play Context System

The summarizer supports flexible, configurable context injection based on summarization goals:

### How It Works
- Define which data tables should be linked depending on the summarizer's goal
- Context documents provide instructions to Claude on how to enhance summarization
- Different context settings can be swapped for different use cases

### Example: Candidate Review
When summarizing a candidate review, the context document can instruct the service to automatically include:
- Related events (interviews, assessments)
- Job applications and positions
- Interview notes and feedback
- Historical candidate interactions

This provides Claude with a richer context window, resulting in more accurate and comprehensive summaries.

## Technical Notes

### Known Considerations
- **Multi-database queries**: The service must query both MySQL and PostgreSQL databases within the same microservice
- **Database triggers**: Need to implement MySQL/PostgreSQL database trigger integration to detect ADMINNOTES updates from any producing application
- **Data contracts**: POST /summarize and GET /getSummary data contracts are currently TBD

### Architecture Decisions
- Keep summarization triggering as an API endpoint for both manual triggering and event-based triggers
- Implement plug-and-play context document system for flexible summarization strategies

## Database Trigger Implementation

### Overview
The system uses database triggers to automatically detect and respond to data changes:

### Trigger Flow
1. **Detection**: PostgreSQL/MySQL triggers detect when ADMINNOTES records are created or updated
2. **Event**: `note_created_trigger` fires and captures the data
3. **Invocation**: Trigger calls the Spring Microservice to process the update
4. **API Call**: Spring Microservice invokes the POST /summarize endpoint
5. **Processing**: Summarizer service retrieves context and sends to Claude
6. **Storage**: Summarized result is stored in NOTES_SUMMARY table

### Key Implementation Points
- Database triggers automatically notify the system of data changes from any producing application
- No polling required - event-driven architecture ensures real-time processing
- Spring Microservice acts as the middleware between database and summarizer API

## Integration with Spring Microservice

The summarizer microservice integrates with a Spring Microservice backend that handles:
- Database trigger event processing
- API endpoint invocation
- Request/response orchestration
- Data transformation and validation

The Spring service provides a bridge between the database layer and the TypeScript/Next.js summarizer, enabling seamless event-driven architecture.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Anthropic API Documentation](https://docs.anthropic.com) - learn about Claude AI integration.
- [Drizzle ORM Documentation](https://orm.drizzle.team) - database ORM details.
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - PostgreSQL features and triggers.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
