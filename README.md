# Outdoor Air Quality & Activity Planner

Project Title - **ClearSkies Planner**
*An Outdoor Air Quality & Activity Planning Web App*

## Project Description

ClearSkies Planner is a web application that helps users make safer, smarter decisions about outdoor activities by combining **weather forecasts** and **air quality data** into a single, easy-to-understand interface.

Instead of manually checking multiple apps, users can:

- View real-time and forecasted air quality and weather
- Receive a clear Go / Delay / Skip recommendation for outdoor activity
- Explore an hourly timeline (up to 72 hours) for optimal activity windows
- Save locations

This project addresses health risks, decision fatigue, and scheduling inefficiencies faced by runners, parents, outdoor workers, and community organizers.

## Target Browsers & Platforms

This application is designed for modern desktop and mobile browsers:

- **Desktop**
  - Google Chrome (latest)
  - Mozilla Firefox (latest)
  - Microsoft Edge (latest)
- **Mobile**
  - iOS Safari
  - Android Chrome

> ⚠️ Internet Explorer is not supported.

## Demo Video

https://youtu.be/EDV3nmbnOTs

# Developer Manual

## 1. Intended Audience

This document is for **future developers** who will maintain or extend the ClearSkies Planner system.

You are expected to:

- Understand web development concepts (REST APIs, Node.js, React/Next.js)
- Be familiar with JavaScript/TypeScript and basic database concepts
- Have no prior knowledge of this project’s internal architecture

## 2. System Architecture Overview

### Front End

- **Framework:** Next.js (React)
- **Styling:** Vanilla CSS
- **Libraries Used:**
  - **Recharts** – visualizing AQI and weather trends
  - **Leaflet** – map visualization using OpenStreetMap

### Back End

- **Runtime:** Vercel Serverless Functions
- **Language:** TypeScript
- **Custom APIs:** Located under `/api/*`

### Database

- **Supabase (PostgreSQL)**
- Stores user profiles, saved locations, and alert history

## 3. Installation & Setup

### Prerequisites

Make sure you have the following installed:

- Node.js (v20+)
- npm
- A Supabase account
- Git

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/clearskies-planner.git
cd clearskies-planner
```

### Install Dependencies

```bash
npm install
```

### EnvironmenT Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

> ⚠️ Never share `.env.local` to GitHub.

## 4. Running the Application Locally

```
npm run dev
```

The application will run at:

```
http://localhost:3000
```

## 5. Running on a Server (Vercel Deployment)

1. Push your repository to GitHub
2. Log in to **Vercel**
3. Import the GitHub repository
4. Add environment variables in Vercel’s dashboard
5. Deploy

Vercel automatically builds and deploys the app using Node.js 20.

## 6. Testing

Currently, this project focuses on functional integration testing via manual validation.

### Planned Improvements

- Unit tests for API normalization logic
- Mocked API response tests
- End-to-end UI tests using Playwright

## 7. API Documentation

### `GET /api/conditions`

**Description:**
 Fetches weather and air quality data for a given location, normalizes units, and computes an activity recommendation.

**Query Parameters:**

- `lat` – latitude
- `lon` – longitude

**Response Example:**

```
{
  "now": {
    "temp": 21.1,
    "aqi": 42,
    "wind": 3.1,
    "precip_prob": 0.1
  },
  "recommendation": {
    "status": "go",
    "reasons": ["AQI < 75", "No rain"]
  }
}
```

------

### `GET /api/locations`

**Description:**
 Retrieves saved locations for the authenticated user from Supabase.

### `POST /api/locations`

**Description:**
 Creates a new saved location in the database.

### `GET /api/profile`

**Description:**
 Returns user preferences such as AQI thresholds and temperature ranges.

## 8. Database Schema

### `profiles`

| Field          | Type    | Description                     |
| -------------- | ------- | ------------------------------- |
| id             | UUID    | User ID                         |
| email          | text    | User email                      |
| aqi_max        | integer | AQI threshold                   |
| temp_min       | integer | Minimum comfortable temperature |
| temp_max       | integer | Maximum comfortable temperature |
| alerts_enabled | boolean | Notification toggle             |

------

### `locations`

| Field   | Type  | Description   |
| ------- | ----- | ------------- |
| id      | UUID  | Location ID   |
| user_id | UUID  | Owner         |
| name    | text  | Location name |
| lat     | float | Latitude      |
| lon     | float | Longitude     |

## 9. Known Bugs & Limitations

- Air quality data may be unavailable in regions with sparse monitoring
- Alert notifications are stored but not yet pushed via email
- Mobile layout is functional but not fully optimized for small screens

## 10. Future Development Roadmap

- Email or push notifications for alerts
- Expanded pollutant analysis (O₃, NO₂)
- Activity-specific recommendations (running vs kids sports)
- Internationalization (i18n)
- Offline caching for recent data

## 11. Data Sources

- **Open-Meteo Weather API** – Weather forecasts
- **OpenAQ API** – Global air quality data
- **OpenStreetMap** – Map tiles via Leaflet