# Freak in the Sheets - Developer Portal

A Next.js 14 application for managing project inquiries and client projects. Built with Node.js, Tailwind CSS, and shadcn/ui components.

## Features

- **Public Inquiry Form** (`/inquire`) - Clients can submit project requests
- **Admin Portal** (`/admin`) - Manage and review all inquiries
- **Template Management** - Create and manage templates
- **Portfolio Management** - Showcase completed projects
- **Inquiry Management** - Mark inquiries as new, accepted, or declined
- **Email Notifications** - Optional email alerts for new inquiries via Resend
- **File-based Storage** - All data stored locally in JSON files

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository
2. Copy `env.local.sample` to `env.local` and fill in your values
3. Install dependencies:
```bash
npm install
```
4. Run the development server:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Admin credentials
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your-session-secret-key

# Base URL
BASE_URL=http://localhost:3000

# Optional: Email notifications
RESEND_API_KEY=your_resend_api_key
BUSINESS_EMAIL=your-email@example.com
```

## Usage

### Public Site

- **Homepage** (`/`) - Landing page with "Start a Project" button
- **Templates** (`/templates`) - Browse available templates
- **Portfolio** (`/portfolio`) - View completed projects
- **Inquiry Form** (`/inquire`) - Project submission form for clients
- **Thank You** (`/thank-you`) - Confirmation page after form submission

### Admin Portal

- **Dashboard** (`/admin`) - Overview of all inquiries and statistics
- **Templates** (`/admin/templates`) - Create and manage templates
- **Portfolio** (`/admin/portfolio`) - Manage portfolio projects
- **Inquiries** (`/admin/inquiries`) - View and manage all inquiries
- **Inquiry Detail** (`/admin/inquiries/[id]`) - Detailed view of individual inquiries

### Inquiry Management

Each inquiry has three possible statuses:

1. **New** - Just submitted, awaiting review
2. **Accepted** - Approved and under development
3. **Declined** - Not pursued

Actions available:
- **Accept** - Mark as approved
- **Decline** - Mark as not pursued
- **Delete** - Permanently remove
- **View** - See full details

## Data Storage

All data is stored locally in JSON files:
- `data/leads.json` - Project inquiries
- `data/templates.json` - Available templates
- `data/portfolio.json` - Portfolio projects

## Development

### Running the App

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure

```
├── app/                    # Next.js app router pages
│   ├── admin/            # Admin portal pages
│   ├── api/              # API routes
│   ├── inquire/          # Inquiry form page
│   └── thank-you/        # Thank you page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── inquiry-form.tsx  # Main inquiry form
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication helpers
│   ├── file-db.ts        # File database utilities
│   └── inquiries.ts      # Inquiry management
├── types/                 # TypeScript type definitions
│   └── inquiry.ts        # Inquiry data types
└── data/                  # Data storage
    └── leads.json        # Inquiry data
```

## Authentication

The admin portal uses NextAuth.js with Google OAuth. Only emails listed in `ADMIN_EMAILS` can access the admin area.

## Customization

### Styling

The app uses Tailwind CSS with a dark zinc theme and emerald accents. Colors can be customized in the component files.

### Form Fields

The inquiry form fields can be modified in:
- `types/inquiry.ts` - Data structure and validation
- `components/inquiry-form.tsx` - Form UI and behavior
- `app/api/inquire/route.ts` - Form processing

### Email Templates

Email notifications are sent via Resend. The email template can be customized in `app/api/inquire/route.ts`.

## Deployment

The app can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- Railway
- Self-hosted

Make sure to:
1. Set all environment variables in production
2. Use a strong `NEXTAUTH_SECRET`
3. Update `NEXTAUTH_URL` to your production domain

## Support

For issues or questions, please check the code or create an issue in the repository. 