@AGENTS.md

# CLAUDE.md

## Project Overview

This project is a front-end web application for a paid amateur football league / halı saha league.

The website has two main areas:

1. Public website

   * Landing page
   * Fixture page
   * Standings page
   * Teams page
   * Team detail page
   * Blog page
   * Blog detail page
   * About page
   * Contact page

2. Admin panel

   * Dashboard
   * Fixture management
   * Team management
   * Player management
   * Standings view/management
   * Blog management
   * Site settings/content management

There is no backend yet. All data must use mock data and localStorage through a repository layer.

The project must be designed so that a real backend API can replace the mock/localStorage layer later with minimal changes.

## Tech Stack

Use:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* next-themes
* react-hook-form
* zod
* Zustand
* date-fns with Turkish locale
* lucide-react

Do not introduce new libraries unless clearly necessary.

## Language Rules

Visible user-facing content must be Turkish.

Route slugs should be Turkish.

Examples:

* `/fikstur`
* `/puan-durumu`
* `/takimlar`
* `/biz-kimiz`
* `/iletisim`

Code-level naming must be English.

Use English for:

* types
* interfaces
* variables
* functions
* components
* stores
* repositories
* file names where possible

Examples:

Use:

* `Team`
* `Player`
* `Match`
* `Standing`
* `BlogPost`
* `SiteSettings`
* `teamRepository`
* `matchRepository`

Do not use code-level Turkish names like:

* `Takim`
* `Oyuncu`
* `Mac`
* `PuanDurumu`
* `BlogYazisi`
* `SiteAyarlari`

## Architecture Rules

Keep public website and admin panel separated.

Use:

* `src/app/(public)` for public pages
* `src/app/admin` for admin pages

Do not mix admin-specific logic into public components.

Do not access localStorage directly inside page or UI components.

All data access must go through the repository layer.

Repository functions should be async from the beginning, even when using mock/localStorage data.

This keeps the future backend migration simple.

## Data Rules

Initial mock data should live under:

* `src/data`

Runtime data should be persisted through localStorage only via repositories/stores.

Use this flow:

Mock JSON seed
→ repository layer
→ store or page/component
→ UI

Never do this:

Component
→ localStorage directly

## Backend Readiness

Assume that every repository function will later become an API call.

Design repository methods like:

* `getTeams`
* `getTeamById`
* `createTeam`
* `updateTeam`
* `deleteTeam`
* `getMatches`
* `updateMatchScore`
* `getBlogPosts`
* `updateSiteSettings`

When the backend arrives, only the repository layer should need major changes.

## Standings Rule

Standings should be calculated from completed match scores by default.

The source of truth should be matches, not manually entered standings.

A manual adjustment/penalty system may be added later, but the first version should use automatic calculation.

## UI Direction

The design should feel like a premium sports league.

Style direction:

* dark-first
* strong contrast
* clean spacing
* modern cards
* subtle gradients
* sharp typography
* responsive layout
* not childish
* not overly colorful

The site should feel trustworthy enough for a paid league with prize money.

## Component Rules

Prefer small, reusable components.

Avoid duplicated UI blocks.

Use shadcn/ui primitives where appropriate.

Use semantic HTML.

Make all components responsive.

Keep components readable and maintainable.

Avoid large files. If a file becomes too large, split it into smaller components.

## Admin Panel Rules

Admin pages must live under `/admin`.

Admin panel should have a separate layout with sidebar and topbar.

Authentication is not real yet.

Use a placeholder/mock auth structure that can later be replaced.

Admin forms should use react-hook-form and zod validation.

Admin CRUD should use stores/repositories and persist with localStorage.

## Task Execution Rules

Work in small tasks.

Before modifying files, briefly state which files you plan to touch.

Do not modify unrelated files.

Do not start the next phase unless explicitly approved.

After each task:

* summarize changed files
* mention important decisions
* mention risks or TODOs
* run lint/build when appropriate

## Current Phase Rule

Complete only the task explicitly requested by the user.

Do not automatically continue to the next phase.

## Quality Checks

Before marking work complete, check:

* TypeScript errors
* lint errors
* responsive behavior
* duplicated components
* accessibility basics
* public/admin separation
* repository discipline
* future backend readiness
