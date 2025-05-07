# Dance Flow - Studio Management System

A modern web application for managing dance studios, classes, and bookings built with Next.js 15 and TypeScript.

## Features

- 🔐 Authentication with NextAuth
- 👥 User and Role Management
- 🏢 Studio Management
- 🎯 Class Scheduling
- 🎨 Modern UI with Shadcn/UI Components
- 📊 Real-time Data Management with React Query
- 🛢️ PostgreSQL Database with Drizzle ORM

## Prerequisites

- Node.js (v19.0.0 or later)
- PostgreSQL Database
- npm or yarn

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd dance-booking-app
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Setup**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dance_flow"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. **Database Setup**

```bash
# Generate database migrations
npm run db-generate

# Run migrations
npm run db-migrate
```

5. **Start Development Server**

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── (auth)/         # Authentication pages
│   ├── admin/          # Admin dashboard pages
│   └── studio/         # Studio management pages
├── components/          # React components
├── db/                  # Database configuration and schemas
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
└── public/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db-generate` - Generate database migrations
- `npm run db-migrate` - Run database migrations
- `npm run db-drop` - Drop database schemas

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Authentication**: NextAuth.js
- **State Management**: React Query
- **UI Components**: Shadcn/UI
- **Styling**: Tailwind CSS
- **Date/Time**: Luxon
- **Forms**: React Hook Form

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, please raise an issue in the repository.