# Film-for-All

A modern Next.js web application that discovers films using the Film API and generates AI-powered insights using OpenAI.

## Features

- 🎬 Search for films using The Movie Database (TMDB) API
- 🤖 AI-powered movie overviews generated with OpenAI
- 🎨 Beautiful, responsive UI built with Tailwind CSS
- ⚡ Server-side rendered with Next.js 16+
- 🚀 Ready for Vercel deployment

## Tech Stack

- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **External APIs:** TMDB (Film API) + OpenAI GPT
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/film-for-all.git
cd film-for-all
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` with your API keys:
```bash
cp .env.local.example .env.local
# Then edit .env.local and add your API keys
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── films/
│   │       ├── search/       # Search films endpoint
│   │       └── overview/     # Generate AI overview endpoint
│   ├── films/
│   │   └── [id]/            # Film detail page with AI overview
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── FilmCard.tsx         # Film card component
│   ├── FilmSearch.tsx       # Search interface
│   └── ...                  # Other components
├── lib/
│   ├── filmApi.ts           # TMDB API client
│   ├── aiOverview.ts        # OpenAI integration
│   └── ...                  # Utility functions
└── types/
    └── film.ts              # TypeScript type definitions
```

## API Routes

### Search Films
- **Endpoint:** `GET /api/films/search`
- **Query Parameters:** `query` (required)
- **Response:** Array of film objects

### Generate Overview
- **Endpoint:** `POST /api/films/overview`
- **Body:** `{ filmId: string }`
- **Response:** Film overview with AI-generated text

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import the repository
4. Add environment variables:
   - `NEXT_PUBLIC_FILM_API_KEY`
   - `OPENAI_API_KEY`
5. Deploy!

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FILM_API_KEY` | Yes | TMDB API key for film data |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI overviews |

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
