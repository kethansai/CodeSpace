# Update Plan — codespace

After completing any implementation task, update the project plan in `docs/plan-codespace.prompt.md` to reflect the current state of the project.

## Instructions

1. **Read the current plan** at `docs/plan-codespace.prompt.md` in full.
2. **Read the conversation context** to identify what was just implemented — which features, components, files, or fixes were completed.
3. **Apply the following updates** to the plan file:

### A. Mark completed items

For each plan item (numbered section or bullet) that has been fully implemented, prepend a `✅` emoji at the start of the line.

**Examples:**

- Before: `### 1. Initialize Vue 3 + Vite + TypeScript project`
- After: `### ✅ 1. Initialize Vue 3 + Vite + TypeScript project`

- Before: `- `AppHeader.vue` — logo, navigation links, search trigger...`
- After: `- ✅ `AppHeader.vue` — logo, navigation links, search trigger...`

For items that are partially done, prepend `🔧` instead:

- `### 🔧 11. Build visualization components` (if some sub-bullets are done but not all)

### B. Add an Implementation Log section

At the **bottom of the file** (before the closing triple-backtick fence if one exists), append or update an `## Implementation Log` section. Each entry should follow this format:

```markdown
## Implementation Log

### YYYY-MM-DD — [Short Title of What Was Done]

**Prompt:** [One-line summary of the user's request]
**Changes:**

- [File created/modified]: [brief description]
- [File created/modified]: [brief description]
  **Status:** Completed | Partial
  **Notes:** [Any deviations from the original plan, new decisions, or follow-ups needed]
```

Add the newest entry at the **top** of the log (reverse chronological order).

### C. Record plan deviations

If the implementation **differs** from what the plan originally specified (e.g., used a different library, skipped a component, added something not in the plan), add a note under the relevant plan section:

```markdown
> **Deviation:** [Description of what changed and why]
```

Also update the **Key Decisions** section if a significant architectural decision was made that contradicts or extends the original plan.

### D. Add new plan items

If the implementation introduced features, components, or sections **not originally in the plan**, add them as new numbered items under the appropriate phase, or create a new phase section if needed. Mark them as `✅` if already completed.

## Rules

- **Do NOT delete** any original plan content — only annotate it.
- **Do NOT change** the overall document structure (phases, numbering, headings).
- Keep the plan as a **single source of truth** for the project's scope and progress.
- Use the exact file paths as they exist in the codebase (not hypothetical paths from the plan).
- When marking sub-bullets, only mark the specific ones that are done — don't mark a parent heading as ✅ unless ALL its children are complete.
- Be precise: only mark items as complete if the feature is **actually implemented and building successfully** — not just partially scaffolded.
