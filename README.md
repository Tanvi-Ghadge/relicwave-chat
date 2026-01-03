# RelicWave AI Chat – MVP

A ChatGPT-style AI chat application built with Next.js, featuring streaming AI responses, GitHub authentication, and conversation persistence for logged-in users.

This project was built as an MVP with a focus on clean architecture, real-world UX, and production-ready engineering decisions.

---

## ✨ Features

### Core Chat
- ChatGPT-like chat interface
- Real-time streaming AI responses (Cohere)
- Clean and responsive UI
- Works for both guest users and authenticated users

### Authentication
- GitHub OAuth using NextAuth
- Secure session handling
- Authentication-aware feature gating

### Persistence (Logged-in Users)
- Conversations saved to database
- Messages stored per conversation
- Sidebar with conversation history
- Ability to delete conversations

### Guest Mode
- AI chat works without login
- No data persistence for unauthenticated users

---

## 🧠 Design Decisions

- Guest-first UX: users can try the product without signing in
- Auth-gated persistence: chats are saved only for logged-in users
- Conversation isolation: each chat is stored independently
- Optimistic UI updates for smooth user experience
- Streaming AI responses for better interaction
- Light-mode only for MVP to avoid system theme inconsistencies.

---

## 🛠 Tech Stack

- Next.js (App Router)
- NextAuth (GitHub OAuth)
- PostgreSQL (Neon)
- Prisma ORM
- Cohere AI (Streaming API)
- Vercel (Deployment)

---

## 🗄 Database Models

- User
- Conversation
- Message

Relationships:
- A user has many conversations
- A conversation has many messages
- Messages are ordered chronologically

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/relicwave-chat.git
cd relicwave-chat

npm install
```
### 2. Create a .env file in the project root and add the following:
```bash
DATABASE_URL=your_neon_database_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

COHERE_API_KEY=your_cohere_api_key


