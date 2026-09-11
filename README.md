# MJ Social Media App — Frontend

> 🚧 This project is currently under development.

A modern social media application frontend built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **React Query**.

This repository contains the frontend application and communicates with a separate Laravel REST API backend.

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* React Query
* React
* REST API
* Git & GitHub

## Features

* User authentication
* User profiles
* Posts
* Image posts
* Likes
* Comments & Replies
* Friend Requests
* Friends system
* Profile statistics
* Avatar & Cover Image Upload
* Infinite Scroll
* Responsive Design

## Project Structure

```text
src/
├── api/
├── app/
├── components/
├── context/
├── hooks/
├── lib/
└── types/
```

## Backend

The frontend communicates with a separate Laravel REST API.

**Backend Repository:**
https://github.com/MohamadJ99/social-media-api

## Getting Started

### 1. Clone the repository

```bash
git clone [frontend-repository-url]
cd [project-folder]
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_STORAGE_URL=http://127.0.0.1:8000/storage
```

### 4. Run the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Status

🚧 **Ongoing Project**

The application is actively being developed, with additional features and improvements planned.

## Author

**Mohammad Jawad Al-Shanableh**

* GitHub: [MohamadJ99](https://github.com/MohamadJ99)
