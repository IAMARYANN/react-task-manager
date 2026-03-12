# React Task Manager

A simple task management application built with React 18 and Vite, integrated with the JSONPlaceholder REST API.

# Features

- Fetch & display tasks — loads 20 todos from JSONPlaceholder when the app starts and shows a loading skeleton while data is being fetched

- Add tasks — form with title (required), description, priority, and due date fields

- Toggle completion — mark tasks as complete or pending with an optimistic UI update and PATCH request

- Delete tasks — remove tasks with a confirmation step before deletion

- Task detail page — view and edit title, description, priority, and due date via the /tasks/:id route

- Search & filter — real-time search by title and filter by All / Pending / Completed

- Sort — tasks can be sorted by priority (high → low) or due date

- Dark / light mode — theme preference is saved in localStorage

- localStorage persistence — tasks remain available after a page refresh

- Overdue indicators — visual warning for tasks that are past their due date

- Custom useFetch hook — small reusable hook for handling loading, error, and API response state

# Tech Stack

- React 18 with functional components and hooks

- React Router v6 (routes: / and /tasks/:id)

- Axios for HTTP requests

- CSS Modules for scoped component styling

- Vite as the development and build tool

# Running Locally

Install dependencies and start the development server:

- npm install
- npm run dev

Then open:

- http://localhost:5173
# How the API Works in This App

- This project uses the JSONPlaceholder API, which is a mock REST API used for testing.

- Operations such as POST, PATCH, PUT, and DELETE return successful responses but do not actually update the server data.

# To simulate real application behavior:

- The app updates tasks in local React state

- Changes are also saved in localStorage

- This allows tasks to persist even after refreshing the page

# New tasks receive a locally generated ID using:

- Date.now()

because the JSONPlaceholder API always returns the same ID (201) for newly created items.

# What I'd Improve With More Time

- Add user authentication so tasks are tied to specific users

- Replace localStorage with a real backend (for example a Python Flask/FastAPI API)

- Add drag-and-drop task reordering

- Improve error handling with retry logic and toast notifications

- Add pagination or infinite scrolling for larger task lists
