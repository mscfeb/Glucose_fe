# Sweety — Blood Glucose Tracker (Frontend)

Responsive React application for recording glucose readings and reviewing daily and monthly trends.

## Features

- Login and registration screens.
- Protected application routes.
- Dashboard with glucose summary cards, a trend chart, and reading management.
- Monthly reports for the current month and previous month.
- Create, edit, and delete glucose readings.
- Form validation and application toast notifications.
- Responsive desktop and mobile layouts.
- Access-token handling through Redux Toolkit and RTK Query.
- Refresh-token cookie support; credentials are included in API requests.

## Technology

- React
- Vite
- JavaScript (ES modules)
- Tailwind CSS
- Redux Toolkit
- RTK Query
- React Router
- React Hook Form and Zod
- Recharts
- Lucide React

## Prerequisites

- Node.js
- npm
- The Sweety backend running locally or deployed

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from `.env.example`:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Set the API base URL:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

4. Start the Vite development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed by Vite (normally `http://localhost:5173`).

## Application routes

| Route | Access | Purpose |
|---|---|---|
| `/login` | Public | Sign in |
| `/register` | Public | Create an account |
| `/dashboard` | Authenticated | Overview and reading management |
| `/reports` | Authenticated | Current and previous month reports |

## Backend connection

The frontend expects the backend API base URL in `VITE_API_BASE_URL`.

For local development:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

The API must allow the frontend origin and credentialed requests. The frontend sends the refresh cookie using `credentials: "include"` and sends the access token as a Bearer token.

## Local demo credentials

For local testing, register the following account through the Register screen, then sign in:

```text
Email:    naveed@example.com
Password: Naveed@123
```


## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

1. Deploy the backend and configure its production environment variables.
2. Configure backend CORS to allow the exact frontend production origin.
3. Set `VITE_API_BASE_URL` in the frontend hosting provider to the deployed backend API URL.
4. Configure refresh-cookie settings for the deployed domain arrangement (Secure, SameSite, and cookie path).
5. Build and deploy the frontend.

Do not put database credentials or JWT secrets in frontend environment variables. Vite variables prefixed with `VITE_` are exposed to the browser.

## Suggested final checks

- Login, registration, refresh, and logout.
- Protected-route redirects.
- Reading creation, update, deletion, and validation errors.
- Dashboard statistics and chart.
- Current-month and previous-month reports.
- Mobile, tablet, and desktop layouts.
- Production build with `npm run build`.

## License

Add the license selected for this repository before publishing.
