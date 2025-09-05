Overview

Neuron Repo is a Next.js application built using the T3 stack (Next.js, NextAuth.js, Prisma, Drizzle, Tailwind CSS, and tRPC). It allows users to connect GitHub repositories, manage projects, ask AI-powered questions about their code, and view commit history. The application uses Clerk for authentication and Google's Gemini API for AI functionalities including code summarization and embedding generation. The client-side utilizes TanStack React Query for data fetching and caching. Dependency management is handled via Bun.

Modules/Components

The application consists of several key modules:

src/server/api/routers/project.ts: This file defines a tRPC router (projectRouter) handling project-related operations. These operations include creating, retrieving, and deleting projects, fetching commits, saving and retrieving questions and answers, and integrating with GitHub via external services (pollCommits and indexGithubRepo). It uses Prisma for database interaction, zod for input validation, and relies on authentication via ctx.user.

src/trpc/react.tsx: Configures the client-side tRPC setup, integrating with React Query. It provides a TRPCReactProvider to make tRPC API calls typesafe and easy for React components. It depends on the AppRouter from "@/server/api/root" and createQueryClient from "./query-client".

bun.lock: This lockfile manages project dependencies, including AI SDKs, UI libraries (Radix UI), Clerk, Langchain, Prisma, React, Next.js, and tRPC. It also lists development dependencies (ESLint, TypeScript, Prettier, Tailwind CSS).

public/liquid-svgrepo-com.svg: A standalone SVG image used as a visual asset within the application.

src/app/(protected)/create/page.tsx: The CreatePage component allows users to link a GitHub repository. It uses react-hook-form for form management, api.project.createProject.useMutation for backend communication, and useRefetch for data updates after project creation. It utilizes various UI components and sonner for toast notifications.

.env.example: An example environment file for setting up the local development environment, primarily focusing on the DATABASE_URL.

.gitignore: Defines files and directories to be ignored by Git.

README.md: The project's README file, providing setup, usage, and deployment instructions.

eslint.config.js: Configures ESLint for code linting and formatting in a TypeScript Next.js project.

package.json: The project's package manifest, listing dependencies, scripts, and metadata.

prettier.config.js: Configures Prettier, a code formatter, to use the prettier-plugin-tailwindcss plugin.

start-database.sh: A bash script for starting a local PostgreSQL database using Docker or Podman.

prisma/schema.prisma: Defines the Prisma schema for the PostgreSQL database, outlining data models for users, projects, code embeddings, questions, and commits.

prisma/migrations/20250829134129_init/migration.sql: SQL migration file defining the initial database schema.

src/components/ui/context-menu.tsx: Defines reusable context menu components based on Radix UI.

components.json: Configuration file for shadcn/ui, defining styling, aliases, and preferences.

next.config.js: Configuration file for the Next.js application, including environment variable loading.

postcss.config.js: Configures PostCSS to use the Tailwind CSS plugin.

tsconfig.json: Configuration file for the TypeScript compiler.

.vscode/settings.json: Configuration settings for the "WillLuke.nextjs" VS Code extension.

prisma/migrations/migration_lock.toml: Specifies PostgreSQL as the database provider.

public/ai-mi-algorithm-svgrepo-com.svg: A standalone SVG image, likely for visual representation.

public/neuron_repo_logo(1).svg: An SVG logo for the application.

src/middleware.ts: Configures Clerk authentication middleware for Next.js.

src/app/page.tsx: Redirects users to the "/dashboard" route.

src/app/(protected)/layout.tsx: Defines the SidebarLayout component with a sidebar and user controls.

src/env.js: Defines and validates environment variables using @t3-oss/env-nextjs and zod.

src/app/layout.tsx: Defines the root layout, wrapping the application in authentication, tRPC, and styling providers.

src/app/(protected)/app-sidebar.tsx: Defines the navigation sidebar component.

src/app/(protected)/QA/page.tsx: Displays and manages questions and answers.

src/app/(protected)/billing/page.tsx: A placeholder for billing information.

src/app/(protected)/dashboard/actions.ts: Server action for asking AI-powered questions about the project's code.

src/app/(protected)/dashboard/commit-log.tsx: Displays project commit log.

src/app/(protected)/dashboard/toggle-switch.tsx: UI for toggling cross-repository search.

src/app/(protected)/essence/actions.ts: Server actions for generating documentation and Mermaid diagrams.

src/app/_components/theme-provider.tsx: Theme provider component for managing application themes.

src/app/api/trpc/[trpc]/route.ts: The main entry point for all tRPC requests.

src/app/sign-in/[[...sign-in]]/page.tsx: Sign-in page using Clerk.

src/app/(protected)/dashboard/ask-question-card.tsx: Component for asking questions and receiving AI-generated answers.

src/app/(protected)/dashboard/code-references.tsx: Component for displaying code references.

src/app/(protected)/dashboard/page.tsx: The main dashboard page.

src/app/(protected)/essence/page.tsx: Component for generating documentation or diagrams using a user prompt.

src/app/(protected)/meetings/page.tsx: Placeholder component for meetings page.

src/app/_components/theme-toggle.tsx: Component for toggling application themes.

src/app/sign-up/[[...sign-up]]/page.tsx: Sign-up page using Clerk.

src/styles/globals.css: Global CSS styles for the application.

src/hooks/use-mobile.ts: Hook for detecting mobile devices.

src/hooks/use-refetch.ts: Hook for refetching React Query queries.

src/lib/github-loader.ts: Functions for loading code from GitHub, generating summaries and embeddings, and storing them in a database.

src/lib/test-commit-flow.ts: Test function for the commit summarization pipeline.

src/server/db.ts: Initializes and exports a Prisma Client instance.

src/components/ui/tooltip.tsx: Tooltip component using Radix UI.

src/hooks/use-project.ts: Hook for managing project-related data.

src/lib/gemini.ts: Functions for generating embeddings and summaries using Gemini.

src/lib/github.ts: Functions for fetching commit history from GitHub, summarizing them, and storing the summaries.

src/lib/utils.ts: Utility functions including class name merging.

src/server/api/root.ts: Defines the main tRPC router.

src/trpc/query-client.ts: Creates a pre-configured QueryClient instance.

src/trpc/server.ts: Sets up tRPC hydration helpers for React Server Components.

Interactions
Data Flow: The client interacts with the backend API (src/server/api/root.ts) through tRPC (src/trpc/react.tsx). The backend uses Prisma (src/server/db.ts) to interact with the PostgreSQL database (prisma/schema.prisma). The projectRouter (src/server/api/routers/project.ts) handles all project-related requests. Authentication is handled by Clerk middleware (src/middleware.ts). AI functionality relies on the Gemini API (src/lib/gemini.ts). GitHub data is fetched and processed by src/lib/github.ts and src/lib/github-loader.ts. React Query (src/trpc/query-client.ts) manages data fetching and caching on the client-side.

Component Interactions: The SidebarLayout (src/app/(protected)/layout.tsx) uses the AppSidebar (src/app/(protected)/app-sidebar.tsx) and Clerk components for user authentication. The DashboardPage (src/app/(protected)/dashboard/page.tsx) integrates with CommitLog (src/app/(protected)/dashboard/commit-log.tsx) and AskQuestionCard (src/app/(protected)/dashboard/ask-question-card.tsx). The AskQuestionCard uses actions defined in src/app/(protected)/dashboard/actions.ts to interact with the AI.

Usage/Flow
Authentication: Users sign in/sign up using Clerk's authentication system (src/app/sign-in/[[...sign-in]]/page.tsx, src/app/sign-up/[[...sign-up]]/page.tsx).

Project Creation: Users can connect a GitHub repository to create a new project (src/app/(protected)/create/page.tsx). This triggers the indexGithubRepo function, which loads the repository's code, generates embeddings, and stores it in the database.

Dashboard: The dashboard (src/app/(protected)/dashboard/page.tsx) displays project details, including a link to the GitHub repository, the commit log (src/app/(protected)/dashboard/commit-log.tsx), and a question-asking interface (src/app/(protected)/dashboard/ask-question-card.tsx).

AI-Powered Q&A: Users can ask questions related to the project's code (src/app/(protected)/dashboard/ask-question-card.tsx). This triggers a server action (src/app/(protected)/dashboard/actions.ts) that uses Gemini to generate answers based on the project's codebase.

Commit Polling: The application periodically polls the connected GitHub repository for new commits (src/lib/github.ts). New commits are summarized by the AI and saved to the database.

Code Summarization: The application uses Gemini to summarize both code files (src/lib/gemini.ts) and commit diffs (src/lib/github.ts). These summaries are stored in the database.

Essence Page: The Essence page (src/app/(protected)/essence/page.tsx) allows generating documentation or Mermaid diagrams based on project code via user prompts, leveraging server actions in (src/app/(protected)/essence/actions.ts).

