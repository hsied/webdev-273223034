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
The implementation successfully adhered to all core specifications, incorporating robust AI error fallbacks and strict service-layer authorization. The agent implemented all planned layers successfully without missing any core features.

## Project Option & Model Feature
- **Project Option:** club events
- **Model Feature:** gemini-2.5-flash model takes raw event text input, returns JSON output with title, summary, and allowed tags, and falls back to default tags when rate-limited or slow.
- **Failure Plan:** If the Gemini API provider is slow (>4s) or rate-limited, the user sees a graceful fallback payload with an error warning and default category tags.

## MCP Tools
| Tool Name | Description |
|---|---|
| list_events | Lists all upcoming club events with remaining capacity for students. |
| register_event | Registers an authenticated user for a specific club event securely. |
| cancel_registration | Cancels an existing user event registration in the system database. |

## Local Sign-in, Provider & Account Linking
- **Local Sign-in:** email and password, hashed securely.
- **Provider:** at least one social provider, such as Google OAuth.
- **Account Linking:** what happens when the same person signs in both ways is merging the accounts via verified institutional email.

## UI Section
- **Stack:** Vanilla HTML, CSS with design tokens (`public/tokens.css`), and JavaScript.
- **Screens:** Implements 4 screen states: Loading, Empty, Success, and Error states in `public/index.html`.
