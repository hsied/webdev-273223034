# Specification: Club Events Management System

## Goals
- Provide an intuitive platform for university students to discover and register for campus club events.
- Enable secure user authentication, double-booking prevention, and capacity enforcement.
- Integrate Gemini AI for automated event copy generation with safety fallbacks.

## Non-goals
- Full payment processing or ticketing fees.
- Multi-language localization (English only for MVP).

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
The initial specification correctly anticipated core entity relationships. The implementation adhered strictly to these specs, successfully incorporating robust error fallbacks for the AI client and strict service-layer authorization.

## Project Option & Model Feature
- **Project Option:** Club Events
- **Model Feature:** AI Event Copy Draft Generator (`src/ai/modelClient.js`)
- **Failure Plan:** If the Gemini API times out (>4s) or throws a rate-limit error, catch the exception, log the warning, and return a graceful fallback payload using the raw idea string with default tags.

## MCP Tools
| Tool Name | Description | Parameters |
|---|---|---|
| `list_events` | Lists all upcoming club events with remaining capacity. | None |
| `register_event` | Registers an authenticated user for a specific club event. | `userId`, `eventId` |
| `cancel_registration` | Cancels an existing user event registration. | `userId`, `eventId` |

## Local Sign-in, Provider & Account Linking
- **Local Sign-in:** Supported via Express session/token headers.
- **Provider:** University institutional email domain (`tu-sofia.bg`).
- **Account Linking:** Maps user ID to registered event records in PostgreSQL.

## UI Section
- Built with vanilla HTML/CSS (`public/index.html`) using design tokens (`public/tokens.css`).
- Implements 4 screen states: Loading, Empty, Success, and Error.
