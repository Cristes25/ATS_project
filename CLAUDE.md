# CLAUDE.md — APPLIK Development Standards

This file contains mandatory standards for all development in this repository.
These rules apply to every file created or modified, without exception.

---

## Formatting Rules

- Variables, function names, and comments must be in Spanish.
- UI-facing strings (labels, placeholders, error messages shown to users) must be in Spanish.
- No emojis in code or comments.
- Comments must be brief and professional. Never reference the conversation, a ticket,
  a task, or why something is missing. If it needs explaining, explain the invariant — not the story.

---

## Before Writing Any Code

1. Read the existing file before editing it.
2. Search for a similar component before creating a new one.
3. Confirm the real API endpoint exists before building the UI that depends on it.
   If the endpoint does not exist yet, do not build the UI with mock data — leave it pending.

---

## Pillar 1 — Professional Code

- No dead imports, unused variables, or unused state.
- No mock/hardcoded data in any file that reaches `main`. If real data is unavailable,
  the feature is incomplete — mark it clearly or do not merge it.
- File length limit: if a file exceeds ~300 lines, evaluate splitting it.
- One responsibility per file. Pages fetch data and render. Components render only.
- No duplicate implementations: before creating Avatar, Modal, Dropdown, or any UI atom,
  check if one already exists in `src/components/ui/`.

---

## Pillar 2 — Secure Code

- Never expose auth decisions, tokens, or role checks in `console.log`.
- All password fields require `minLength={8}`.
- File uploads require both extension validation AND MIME type validation AND a size limit.
- Never silence errors with `.catch(() => {})`. Always surface the error to the user
  or at minimum re-throw it.
- Form inputs that accept structured data (RUC, phone, etc.) require a `pattern` attribute.
- Backend error messages must be sanitized before displaying to users.

---

## Pillar 3 — Optimized Code

- All `fetch()` calls belong in `src/api/`. Never call `fetch()` directly inside a component or page.
- Use the shared `apiFetch()` client from `src/api/client.js` for all authenticated requests.
- Public endpoints (no auth required) use `apiFetch(url, { auth: false })`.
- Do not fetch all records to display a subset. Use server-side pagination or limit params.
- Search inputs require debounce before triggering a fetch.
- Heavy libraries (pdfjs, recharts, framer-motion) must be lazy-loaded, not imported at the top level.

---

## Pillar 4 — Intelligent Code

- No magic numbers. If a value has meaning (e.g. `5 * 1024 * 1024`), extract it to a named constant.
- No copy-pasted logic. If the same block appears twice, it becomes a shared utility or hook.
- Token retrieval (`localStorage.getItem("applik_token")`) happens only in `src/api/client.js`,
  nowhere else.
- Gradient and color values belong in `tailwind.config.js`, not hardcoded inline repeatedly.
- `getTenantId()` and similar utilities must have a single implementation in `src/lib/`.

---

## API Layer Rules

- `src/api/auth.js` — auth service functions only
- `src/api/jobs.js` — job service functions only
- `src/api/talent.js` — talent service functions only
- `src/api/ai.js` — AI service functions only
- `src/api/client.js` — shared fetch wrapper, no business logic

New services get a new file. No cross-service calls in the same api file.

---

## What "Done" Means

A feature is done when:
- It calls a real endpoint (not mock data)
- Errors are handled and shown to the user
- It has no console.log statements
- It uses `apiFetch` from the API layer, not raw `fetch()`
- It passes a basic read-through without dead code
