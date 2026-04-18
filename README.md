# WeTeachs Web

A modern chat and learning platform built with Next.js, React, TypeScript, Tailwind CSS, and Firebase.

## Requirements

- **Node.js**: v22.19.0 (LTS recommended)
- **Next.js**: 15.5.9

## Getting Started

1. **Clone the repository:**

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**

   ```bash
   pnpm run dev
   # or
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Build for Production

```bash
pnpm run build
pnpm run start
```

## Linting

```bash
pnpm run lint
```

## Tech Stack
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Firebase

## Project Flow

1. **Landing & Home**
   - The app starts at `/` with a landing page featuring a hero section, recent users, features, categories, and testimonials.

2. **Authentication**
   - Users must sign up or log in to access most features.
   - Auth pages: `/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/verify-email`.

3. **Profile Creation**
   - New users are prompted to complete their profile at `/create-profile`.

4. **Dashboard & Navigation**
   - After login, users access the dashboard and can navigate to chat, community, categories, upload, and more via the sidebar/header.

5. **Chat System**
   - Users can view and search conversations, start new chats, and send messages (text, images, videos).
   - Chat features include: reply, edit/delete own messages, report inappropriate messages, and WhatsApp-style reply bubbles.
   - Media sharing and message actions are handled in the chat UI.

6. **Calls**
   - Users can initiate and receive audio/video calls.
   - Call logs and statuses are displayed in the chat/calls section.

7. **Community & Categories**
   - Users can browse, create, and interact with community posts and categories.

8. **Other Features**
   - Download resources, view FAQs, contact support, and manage settings.
   - Profile and expert viewing, leaderboard, and privacy policy pages.

9. **Admin/Expert Features**
   - Special flows for teachers/experts, including profile management and category creation.

10. **Tech Stack**
    - Built with Next.js (App Router), React 19, TypeScript, Tailwind CSS, Firebase (Firestore & Storage), shadcn/ui, lucide-react, and sonner.

---

For more details, see the code and comments in the repository.

---
