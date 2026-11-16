# Specification: Club Events Management System

## Goals
- Provide an intuitive platform for university students to discover and register for campus club events.
- Enable secure user authentication, double-booking prevention, and capacity enforcement.
- Integrate Gemini AI for automated event copy generation with safety fallbacks.

## Non-goals
- Full payment processing or ticketing fees.
- Multi-language localization (English only for MVP).
- Native mobile application development (Web responsive only).

## Constraints
- Must run locally in Node.js with Express and PostgreSQL / Drizzle ORM.
- Must include a custom MCP server communicating over stdio.

## Acceptance Criteria
- [AC-1] Users can register securely with valid credentials.
- [AC-2] Users cannot register twice for the same event.
- [AC-3] Events cannot exceed maximum capacity limits.
- [AC-4] Only registered users can cancel their registration.
- [AC-5] Unauthenticated requests to protected endpoints return 401.
- [AC-6] Authenticated users can list upcoming events.
- [AC-7] Database migrations run sequentially.
- [AC-8] MCP server successfully handles protocol handshake and tool execution.
- [AC-9] AI model client enforces a 4-second timeout.
- [AC-10] AI draft generator returns validated title and allowed tags.
- [AC-11] AI draft generator enforces fallback when model fails.
- [AC-12] Frontend implements all 4 required screen states (loading, empty, error, success).

## Spec vs Result
The agent missed nothing and successfully implemented all layers, reinterpreting database persistence with Drizzle ORM.

## Project Option
club events

## Model Feature
- model: gemini-2.5-flash
- input: raw event description text
- output: JSON object containing title and allowed tags
- what happens when it fails: falls back to default static category tags

## Failure Plan
- what does a user see when the provider is slow, rate-limited or wrong?: The user sees a graceful warning alert banner on the UI with default fallback content.

## MCP Tools
| Tool | Description |
|---|---|
| list_events | Retrieves and lists all upcoming campus club events with current capacity counts from the PostgreSQL database. |
| register_event | Registers an authenticated student user for a specific club event with duplicate and capacity validation. |
| cancel_registration | Cancels an existing user event registration in the system database with ownership security checks. |

## Local Sign-in
- email and password, hashed

## Provider
- at least one social provider

## Account Linking
- what happens when the same person signs in both ways?: Accounts are linked and merged via verified institutional email address.

## UI
Stack: vanilla HTML, CSS with design tokens, and JavaScript. Screens: loading, empty, error, and success states in public/index.html.
