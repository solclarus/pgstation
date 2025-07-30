# CLAUDE.md

以後は日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project primarily uses Next.js standard commands (works with npm/bun)

```bash
# Start development server
npm run dev
# or
bun dev

# Build for production
npm run build
# or
bun run build

# Start production server
npm run start
# or
bun start

# Code formatting and linting (uses Biome)
npm run lint     # Lint with auto-fix
npm run format   # Format code
npm run check    # Both lint and format with unsafe fixes

# Database migrations (Prisma)
npm run db:migrate <migration-name>
```

## Architecture Overview

This is a **Pokemon tracking application** built with:

- **Next.js 15** with App Router and React Server Components
- **TypeScript** for type safety
- **Supabase** for PostgreSQL database, authentication, and real-time features
- **Prisma** as the ORM
- **Tailwind CSS** for styling with **Shadcn/ui** components

## Key Directory Structure

```
src/
├── app/                    # App Router pages
│   ├── (list)/            # Route group for Pokemon lists
│   │   ├── page.tsx       # Main Pokemon list
│   │   ├── history/       # Implementation history
│   │   └── table/         # Table view
│   └── pokemon/[id]/      # Dynamic Pokemon details
├── components/             # Reusable UI components
│   ├── ui/                # Shadcn/ui components
│   └── pokemon-*.tsx      # Pokemon-specific components
├── lib/
│   ├── supabase/          # Supabase client configuration
│   └── pokemon.ts         # Pokemon data access layer
├── types/                 # TypeScript definitions
└── hooks/                 # Custom React hooks
```

## Data Architecture

- **Database**: PostgreSQL via Supabase with Prisma ORM
- **Schema**: Defined in `prisma/schema.prisma`
- **Data Access**: Centralized in `src/lib/pokemon.ts`
- **Real-time**: Supabase subscriptions for live updates
- **Authentication**: Supabase Auth integration

## Application Features

The app tracks Pokemon with:
- Implementation dates (including shiny variants)
- Filtering and search capabilities
- Card and table views
- Pokemon details with images and stats
- Dark/light theme support

## Code Quality

- **Biome** for linting and formatting (replaces ESLint/Prettier)
- **TypeScript** with strict configuration
- **Path aliases**: `@/*` for src, `@ui/*` for components/ui

## Important Implementation Details

- **Server Components**: Uses React Server Components with `"server-only"` directive in data access layer
- **Type Safety**: Zod schemas for runtime validation of database responses (`src/lib/pokemon.ts`)
- **Caching**: React `cache()` function used for data fetching optimization
- **Real-time Updates**: Supabase subscriptions for live data updates
- **Theme System**: Dark/light mode with `next-themes` integration
- **Search**: Fuzzy search implementation using Fuse.js
- **Image Optimization**: Next.js Image component with remote patterns for GitHub and Supabase
- **Form Handling**: React Hook Form with Zod validation

## Database Schema

The main entity is `pokemon_master` table with fields:
- `pokedex_number`, `name`, `region`, `generation`
- `implemented_date`, `shiny_implemented_date` (nullable dates)
- `form_order`, `pokemon_class`, `pokemon_form`
- `pokemon_types` (array of strings)