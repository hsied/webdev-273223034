# Instructions for the agent

Read this file at the start of every session. Keep it short and correct; update it when the project changes.

## Project
Build a club events management system where student clubs publish capacity-limited events and students register, browse, and cancel registrations.
See `SPEC.md` for goals, non-goals and acceptance criteria.

## Commands
- Install: `npm install`
- Run: `npm run dev`
- Test: `npm test`
- Coverage: `npm test -- --coverage`
- MCP server: `npm run mcp`

## Conventions
- Folder layout: `src/routes/` (HTTP), `src/services/` (Business logic), `src/db/` (Database & migrations), `mcp-server/` (MCP), `public/` (Frontend).
- Business rules and database queries return standardized errors and use async/await.

## Layers
Requests arrive two ways and both end in the same place:

- HTTP route handler → service → data access → database
- MCP tool → **the same service** → data access → database

A route handler reads the request and turns a result into a status code. A service holds the
rules and knows nothing about HTTP or about MCP. Only the data layer writes SQL. An MCP tool
that talks to the database directly is a second, unguarded way into your data: never add one.

## The model feature
- The provider is named in exactly one file: `src/ai/modelClient.js` (Google Gemini API, `gemini-2.5-flash`).
- The key comes from an environment variable (`GEMINI_API_KEY`) and is never committed or logged.
- Every call has a timeout (4000ms) and a deterministic fallback, so the app still works when the provider is down or rate-limited.
- The model's output is re-checked against real data before anything is saved or shown.
- Tests never call the provider: they pass in a fake client.

## The MCP server
- Lives in `mcp-server/`, grew out of Exercise 1.
- Every tool calls a service function; none touches the data layer or the database directly.
- It carries a user, and enforces exactly the same authorization rules as the HTTP API.
- Adding a tool means adding a row to the table in `SPEC.md` too.

## Tests and coverage
- Every acceptance criterion in `SPEC.md` has an id like `AC-3`, and a test whose title contains that id.
- The coverage gate runs in CI: 100% of the service layer, 80% overall.
- A test is evidence. Changing a test so the code passes destroys the evidence.

## Always ask before
- deleting files or folders
- editing a migration that has already run
- installing or removing dependencies
- pushing, tagging or changing CI
- anything that touches secrets or `.env`
- changing an authentication or authorization rule
- adding, renaming or removing an MCP tool
- changing a coverage threshold
- sending user data to a third-party model

## Never
- commit secrets, passwords, API keys or an OAuth client secret
- weaken or delete a test to make it pass
- lower a coverage threshold or switch off a CI job to make the build green
- add an MCP tool that reaches past the service layer
- log a prompt that contains somebody's personal data