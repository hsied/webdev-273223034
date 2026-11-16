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

## Spec vs Result Note
The agent missed nothing and successfully implemented all layers, reinterpreting database persistence with Drizzle ORM.

## Project Option & Model Feature
- Project option: club events
- Model feature: Model is gemini-2.5-flash, input is raw text, output is JSON title and tags, failure falls back to default tags.
- Failure plan: When the provider is slow or rate-limited, the user sees a graceful fallback warning message on the UI.

## MCP Tools
| Tool Name | Description |
|---|---|
| list_events | Lists all upcoming club events with remaining capacity for students in the database. |
| register_event | Registers an authenticated user for a specific club event securely with capacity checks. |
| cancel_registration | Cancels an existing user event registration in the system database with ownership validation. |

## Local Sign-in, Provider & Account Linking
- Local sign-in: email and password, hashed
- Provider: Google OAuth
- Account linking: what happens when the same person signs in both ways is merging accounts via verified institutional email.

## UI Section
- Stack: vanilla HTML, CSS with design tokens, and JavaScript.
- Screens: loading, empty, error, and success states in public/index.html.
