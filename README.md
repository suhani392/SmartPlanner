# Smart Task Planner

**Smart Task Planner** is an AI-driven scheduling application designed to help students and professionals organize their workload effortlessly. It doesn't just list tasks; it automatically generates a structured weekly timetable based on your specific deadlines and priorities.

## Key Features

- **Supabase Authentication**: Secure login and registration with user profile syncing.
- **Dynamic Weekly Planner**: Automatically generates a timetable organized by categories (Exams, Projects, College, etc.).
- **Flexible Scheduling**: 
    - **Not Applicable (NA)**: For tasks without specific times.
    - **Estimated Duration**: Automatically calculates end-times based on your start-time.
    - **Fixed Time**: Set precise start and end times for rigid schedules.
- **Priority-Based Visuals**: Tasks are color-coded (Red for High, Yellow for Medium, Green for Low) in the planner for quick scanning.
- **Global Dashboard**: Provides a "Planner's Summary" and lists the next 5 most urgent tasks.
- **Responsive UI**: A premium, clean, and modern interface built with Vanilla CSS.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React), Vanilla CSS
- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Deployment**: [Vercel](https://vercel.com/) (Frontend), [Render](https://render.com/) (Backend)

## Project Structure

```text
smart-task-planner/
├── frontend/             # Next.js Application
│   ├── assets/           # Logos and static assets
│   ├── components/       # Reusable UI components
│   ├── pages/            # App routes (Dashboard, Planner, etc.)
│   └── utils/            # Supabase and API logic
└── backend/              # Express API
    ├── config/           # Database connection
    ├── controllers/      # Business logic
    ├── routes/           # API endpoints
    └── services/         # Timetable generation algorithm
```

## Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd smart-task-planner
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```text
DATABASE_URL=your_supabase_postgresql_connection_string
PORT=5000
```
Run the server:
```bash
node index.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend/` folder:
```text
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Run the development server:
```bash
npm run dev
```

## Database Schema
The database requires two main tables in Supabase:
- `users`: Managed via Supabase Auth + Trigger/Sync.
- `tasks`: Includes columns for `time_type`, `start_time`, `end_time`, and `priority`.
- `generated_plans`: Stores the optimized timetable data.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
