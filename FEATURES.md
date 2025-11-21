# TAJAM Features Overview

## Homepage
- Clean, minimalist editorial design
- Latest articles displayed in a grid
- Dark/light mode toggle (persistent)
- Direct links to archive, categories, search, and dashboard

## Authentication
- Firebase email/password authentication
- Secure login page
- Session management with localStorage
- Protected dashboard access

## CMS Dashboard
- Two-tab interface: "My Articles" and "New Article"
- Create, read, update, and delete articles (CRUD)
- Article editor with rich text support
- Category selection
- Manual and automatic tag management
- Thumbnail image upload to Firebase Storage

## Content Management
- Real-time Firestore integration
- Publish/unpublish articles
- Edit existing articles
- Delete articles with confirmation
- View article metadata (created date, status)

## Frontend Pages
- **Homepage** (`/`): Latest articles
- **Archive** (`/archive`): All published articles chronologically
- **Categories** (`/categories`): Browse by category
- **Search** (`/search`): Search articles by title, excerpt, tags
- **Login** (`/login`): Author authentication
- **Dashboard** (`/dashboard`): CMS for authors
- **Article** (`/articles/[slug]`): Individual article view

## Dark Mode
- System preference detection
- Manual toggle button
- Persistent localStorage storage
- Full color scheme support for all components

## SEO Features
- Meta tags for all pages
- Open Graph tags for social sharing
- Automatic sitemap generation
- robots.txt for search engines
- Semantic HTML structure

## Security
- Firebase authentication
- Row-level security in Firestore
- Protected routes and API endpoints
- Secure image storage
- HTTPS-only in production

## Technical Stack
- Next.js 16 with App Router
- React 19
- Tailwind CSS v4
- Firebase (Auth, Firestore, Storage)
- TypeScript
- Responsive design

\`\`\`
