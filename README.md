# Film-for-All

A modern Next.js web application that discovers films using the Film API and generates AI-powered insights using OpenAI.

## Features

- 🎬 Search for films using The Movie Database (TMDB) API
- 🤖 AI-powered movie overviews generated with OpenAI
- 🔐 User authentication with Google OAuth
- 👤 User profile management
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
- Google OAuth Credentials ([Set up here](https://console.developers.google.com/))

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

**Required Environment Variables:**
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `NEXTAUTH_SECRET`: Random secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set authorized redirect URIs to:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env.local`

**Note:** The app is pre-configured to allow Google profile images from `lh3.googleusercontent.com`, `lh4.googleusercontent.com`, `lh5.googleusercontent.com`, and `lh6.googleusercontent.com` domains.

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
│   │   ├── auth/[...nextauth]/  # NextAuth API route
│   │   └── films/
│   │       ├── search/          # Search films endpoint
│   │       └── overview/        # Generate AI overview endpoint
│   ├── auth/
│   │   ├── signin/             # Sign in page
│   │   └── signup/             # Sign up page
│   ├── user/
│   │   └── profile/            # User profile page
│   ├── films/
│   │   └── [id]/               # Film detail page with AI overview
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   ├── AuthForm.jsx            # Authentication form component
│   ├── FilmCard.tsx            # Film card component
│   ├── FilmSearch.tsx          # Search interface
│   ├── Navigation.jsx          # Dynamic navigation component
│   ├── SessionProvider.jsx     # NextAuth session provider
│   └── ...                     # Other components
├── lib/
│   ├── filmApi.ts              # TMDB API client
│   ├── aiOverview.ts           # OpenAI integration
│   └── ...                     # Utility functions
└── types/
    └── film.ts                 # TypeScript type definitions
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
