# Club Events Management System

## Project option
club events

## Goals
- Provide a web application where student clubs publish capacity-limited events and students register, browse, and cancel registrations.
- Expose a secure REST API between frontend and backend backed by a PostgreSQL relational database with numbered migrations.
- Support dual sign-in (local email/password with bcrypt hashing and Google OAuth) syncing to a single user account via verified emails.
- Implement an AI text-model feature using Google Gemini to generate event titles, summaries, and allowlist tags from rough notes, with a strict timeout and deterministic fallback.
- Provide a custom MCP server over the project data with at least 5 tools mapped to the same service layer as the REST routes.
- Deliver a fully responsive UI adhering to design tokens, covering all 4 screen states (loading, empty, error, success), and supporting keyboard navigation.
- Maintain at least 80% automated test coverage with full `[AC-X]` test ID traceability.

## Non-goals
- Complex role management (co-organizers, waitlists, multi-level permissions).
- Real-time chat, WebSockets, or automated email notifications.
- Poster image uploads or multi-modal vision processing.

## Constraints
- All database schema changes must be delivered as numbered SQL migrations.
- Authorization checks (ownership of clubs and registrations) must live entirely in the service layer.
- Model output must be strictly validated against a fixed tag allowlist.
- Secrets (API keys, client secrets) must never be committed to the repository.

## The model feature
- **Model:** Google Gemini API (`gemini-2.5-flash`).
- **Input:** A rough one-line event idea typed by an organizer (e.g., `"rust workshop next Thursday in room 204"`).
- **Output:** A structured JSON object containing a clean `title`, a 2-sentence `summary`, and up to 3 category tags.
- **Fallback & Error Handling:** Enforces a 4-second timeout. If the API key is missing, rate-limited (`429`), or times out, the service falls back gracefully: uses the raw input as the title, sets summary to empty, assigns `["general"]` tags, and flags `fallbackUsed: true` without failing the request.
- **Data Privacy:** Only the organizer's draft text and allowed tag strings are sent to the Gemini API. No user emails, passwords, or personal data leave the server.

## Auth
- Local authentication via email and password hash (bcrypt).
- Social authentication via Google OAuth 2.0. Accounts are linked on verified email addresses only.

## MCP tools
1. `upcoming_events` — List all upcoming club events with remaining seat counts, dates, locations, and tags.
2. `my_registrations` — List all events the currently authenticated student is registered to attend.
3. `register_for_event` — Register the authenticated student for a specific upcoming club event by its event ID.
4. `cancel_registration` — Cancel the authenticated student's existing registration for a specific event ID.
5. `draft_event_copy` — Generate a clean title, summary, and category tags from a short one-line event idea.

## UI
- Built with design tokens for colors, spacing, typography, and border radius.
- Fully responsive across 380px, 768px, and 1280px viewports with zero horizontal scrolling.
- Every screen handles loading, empty, error (readable sentences), and success states.
- Fully navigable via keyboard with visible focus outlines and minimum 4.5:1 text contrast.

## Acceptance criteria
- [AC-1] User can register locally with email and password; password is stored as a bcrypt hash.
- [AC-2] User can sign in with local credentials and receive a valid session.
- [AC-3] Signing in via Google OAuth with a verified email links to the existing user account.
- [AC-4] Google OAuth sign-in is rejected with 403 if email is unverified.
- [AC-5] Only the club organizer can create, update, or delete events for that club.
- [AC-6] Authenticated user can register for an upcoming event with open capacity.
- [AC-7] Registering for an event at full capacity is rejected with 409 Conflict.
- [AC-8] Registering twice for the same event is rejected with 409 Conflict.
- [AC-9] User can cancel their own registration, freeing a seat.
- [AC-10] AI event draft generator returns validated title, summary, and allowed tags.
- [AC-11] AI event draft generator enforces timeout and fallback without throwing errors.
- [AC-12] MCP tools execute through the same service layer and enforce session authorization.
