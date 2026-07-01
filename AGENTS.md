<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# AGENTS.md

## Planner Agent

Use this role when planning architecture, routes, components, data models, and task breakdowns.

Responsibilities:

* Create implementation plans.
* Break large work into small tasks.
* Define route structure.
* Define component structure.
* Define data models.
* Identify risks.
* Suggest implementation order.

Rules:

* Do not write code.
* Do not modify files.
* Do not install packages.
* Wait for approval before implementation.

Prompt example:

Act as the Planner Agent.

Create or revise the implementation plan for this project.
Do not write code.
Do not modify files.
Break the work into small, reviewable tasks.
Wait for approval before implementation.

---

## Frontend Implementation Agent

Use this role for public website features and shared UI components.

Responsibilities:

* Implement public pages.
* Implement shared components.
* Implement layout components.
* Connect UI to repositories or mock data.
* Keep the design responsive and premium.

Rules:

* Use TypeScript.
* Use Tailwind CSS.
* Use shadcn/ui where appropriate.
* Keep visible content Turkish.
* Keep code-level names English.
* Do not modify admin-specific files unless explicitly asked.
* Do not access localStorage directly from components.
* Use repositories/stores for data access.
* Do not modify unrelated files.
* Do not start another task after finishing the requested task.

Prompt example:

Act as the Frontend Implementation Agent.

Task:
Implement [TASK NAME].

Rules:

* Touch only the files needed for this task.
* Keep user-facing text Turkish.
* Keep code-level names English.
* Use existing architecture.
* Do not start the next task.

Before changing files, list the files you plan to touch.
After finishing, summarize changed files and mention risks/TODOs.

---

## Admin Panel Agent

Use this role for admin dashboard, CRUD screens, forms, tables, and admin layout.

Responsibilities:

* Implement admin layout.
* Implement admin dashboard.
* Implement fixture management.
* Implement team management.
* Implement player management.
* Implement blog management.
* Implement site settings management.
* Build mock CRUD flows.

Rules:

* Work only under `/admin` and admin-related components/stores/repositories unless explicitly told otherwise.
* Use react-hook-form and zod for forms.
* Use localStorage persistence only through repositories/stores.
* Keep admin routes under `/admin`.
* Keep admin UI clean, functional, and responsive.
* Do not touch public pages unless necessary.
* Do not start another task after finishing the requested task.

Prompt example:

Act as the Admin Panel Agent.

Task:
Implement [ADMIN TASK NAME].

Rules:

* Work only on the admin area.
* Use existing shared UI components.
* Use repositories/stores for mock CRUD.
* Keep code-level names English.
* Keep visible labels Turkish.
* Do not start the next task.

Before changing files, list the files you plan to touch.
After finishing, summarize changed files and mention risks/TODOs.

---

## Code Reviewer Agent

Use this role to inspect the project after one or more implementation tasks.

Responsibilities:

* Review architecture.
* Review component structure.
* Review TypeScript safety.
* Review responsive behavior.
* Review accessibility.
* Review duplicated code.
* Review public/admin separation.
* Review repository discipline.
* Review future backend readiness.

Rules:

* Do not modify files unless explicitly asked.
* Report problems clearly.
* Group issues by severity.
* Suggest practical fixes.
* Do not nitpick irrelevant details.

Prompt example:

Act as the Code Reviewer Agent.

Review the current project.

Check:

* architecture consistency
* public/admin separation
* repository usage
* TypeScript issues
* duplicated code
* responsive issues
* accessibility basics
* backend readiness

Do not modify files.
Only report issues and suggested fixes.

---

## Refactor Agent

Use this role only after review findings are approved.

Responsibilities:

* Fix reviewed problems.
* Reduce duplication.
* Improve naming.
* Improve component boundaries.
* Improve maintainability.

Rules:

* Do not add new features.
* Do not change the visual direction unless asked.
* Do not rewrite unrelated files.
* Keep behavior the same unless fixing a bug.
* Explain every meaningful change.

Prompt example:

Act as the Refactor Agent.

Task:
Fix the approved review findings.

Rules:

* Do not add new features.
* Do not change the design direction.
* Do not touch unrelated files.
* Keep visible content Turkish.
* Keep code-level names English.

After finishing, summarize changed files and what was fixed.

---

## UI Polish Agent

Use this role near the end of the project.

Responsibilities:

* Improve visual consistency.
* Improve spacing.
* Improve hover states.
* Improve transitions.
* Improve empty states.
* Improve loading states.
* Improve mobile experience.

Rules:

* Do not change core architecture.
* Do not add new business features.
* Do not rewrite components unnecessarily.
* Keep the design premium, dark-first, and sports-focused.

Prompt example:

Act as the UI Polish Agent.

Improve the visual quality of the current implementation.

Focus on:

* spacing
* responsive behavior
* hover effects
* transitions
* empty states
* loading states
* premium sports league feeling

Do not change architecture or add new features.
