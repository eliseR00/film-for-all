<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Film-for-All Development Guidelines

This is a Next.js application with:
- Film/Photography API integration for fetching film stock data
- AI-powered overview generation using OpenAI
- Vercel deployment ready configuration

## Tech Stack
- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Integration:** Film API (https://filmapi.vercel.app/api/films) + OpenAI GPT
- **Deployment:** Vercel

## Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and API clients
└── types/               # TypeScript type definitions
```

## Development Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint checks

## Environment Variables
Create a `.env.local` file with:
```
OPENAI_API_KEY=your_openai_api_key
```

## Key Files
- `src/app/api/` - API routes for backend logic
- `src/components/` - React components for UI
- `src/lib/filmApi.ts` - Film API integration
- `src/lib/aiOverview.ts` - AI overview generation

## API Details
- **Film API:** https://filmapi.vercel.app/api/films (No API key required)
- Returns photography/camera film data with detailed specifications

