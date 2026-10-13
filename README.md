# RoadRescue — Frontend

React 19 + Vite single-page app for RoadRescue — a real-time roadside
assistance platform with three role-based experiences: Vehicle Owner,
Mechanic, and Admin.

## Tech Stack

- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router 7
- **State:** React Context API (Auth, Socket, Vehicle, ServiceRequest, Subscription)
- **Real-time:** Socket.IO client
- **Maps:** Leaflet + OpenStreetMap tiles
- **Payments:** Razorpay Checkout

## Getting Started

```bash
npm install
cp .env.example .env    # set VITE_API_URL to your backend
npm run dev               # http://localhost:5173
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## Project Structure
src/
├── components/ reusable UI, grouped by domain
├── pages/ route-level views (user / mechanic / admin)
├── context/ global state providers
├── utils/ API client, validators, helpers
└── data/ static reference data (services, social links)


## Key Features

- Role-based registration/login (Vehicle Owner, Mechanic, Admin)
- Live geolocation-based nearby-mechanic search — public, no login required
- Real-time GPS tracking of an assigned mechanic during an active job
- Instant toast notifications on request accept/status-change/cancel
- Razorpay-powered invoice payments (test mode)
- Full admin back-office: verification, coupons, complaints, reports

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

Deploys as a static SPA (Vercel-ready — see `vercel.json`).