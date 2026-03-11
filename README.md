# React Task Manager

A task management app built with React 18 + Vite, integrated with the JSONPlaceholder REST API.

## Features

- **Fetch & display tasks** — loads 20 todos from JSONPlaceholder on startup with a loading skeleton
- **Add tasks** — form with title (required), description, priority, and due date fields
- **Toggle completion** — optimistic UI update with PATCH to API
- **Delete tasks** — inline confirmation before permanent removal
- **Task detail page** — edit title, description, priority, due date via `/tasks/:id` route
- **Search & filter** — real-time search by title, filter by All / Pending / Completed
- **Sort** — by priority (high → low) or due date
- **Dark / light mode** — persisted in localStorage
- **localStorage persistence** — tasks survive page refresh
- **Overdue indicators** — visual warning for past-due incomplete tasks
- **Custom `useFetch` hook** — reusable hook encapsulating loading/error/data state
- **Responsive layout** — works on mobile and desktop

## Tech Stack

- React 18 with functional components + hooks
- React Router v6 (2 routes: `/` and `/tasks/:id`)
- Axios for HTTP requests
- CSS Modules for scoped styles
- Vite as the build tool

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## How it works

Since JSONPlaceholder is a mock API, POST/PATCH/PUT/DELETE calls return fake success responses. The app simulates real state changes locally after each API call — tasks added, edited, or deleted are reflected immediately in the UI and persisted to `localStorage`.

New tasks get a locally-generated ID (`Date.now()`) since the mock API always returns `id: 201`.

## What I'd improve with more time

- Add user authentication so tasks are per-user
- Replace localStorage with a real backend (e.g. Supabase or a simple Express API)
- Add drag-and-drop reordering
- Unit tests with React Testing Library for the context and components
- More nuanced error handling with retry logic and toast notifications
- Pagination or infinite scroll for larger task lists
