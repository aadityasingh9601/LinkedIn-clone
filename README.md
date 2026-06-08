# LinkedIn Clone

A full-stack LinkedIn clone built with React (Vite) on the frontend and Node.js/Express with MongoDB on the backend. Implements core social networking features: posts with scheduling, comments, likes, polls, jobs with applications, real-time messaging, notifications, connections, follows, analytics, and profile management.

## Features

- **User Authentication**: Sign up, login, JWT access/refresh token rotation, protected routes
- **Profile Management**: Editable header (banner, avatar, headline, location, contact), about section, skills, education, experience — all with CRUD
- **Posts**: Create, edit, delete text/image posts; audience selection (Everyone / Connections only); scheduled posting via cron scheduler
- **Comments**: Add, edit, delete comments on posts
- **Likes**: Like/unlike posts with real-time count
- **Polls**: Create polls with multiple options, vote/unvote, TTL-based auto-expiry
- **Jobs**: Create, edit, delete job listings; filter by saved/applied/my postings; job fit stats with matched/missing skills
- **Job Applications**: Apply with answers and resume PDF (GridFS storage); review/reject flow; resume download
- **Real-time Messaging**: Socket.io-based one-to-one chat with text, media, edit, delete — all reflected in real-time
- **Notifications**: Real-time notifications for likes, comments, connection requests, job application responses; mark as read; auto-cleanup after 30 days
- **Connections**: Send, accept/reject, remove connections
- **Follows**: Follow/unfollow users; follower/following lists; remove followers
- **Network Page**: Browse followers, following, and connections in one place
- **Analytics**: Track profile views, search appearances, followers, post impressions; date-range-filtered line chart dashboard
- **Scheduled Posts**: Cron-based scheduler runs every minute to publish queued posts automatically

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6 (lazy-loaded pages)
- **State Management**: Zustand (12 stores)
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Socket.io-client
- **UI**: CSS Modules, React Toastify, React Loader Spinner
- **Charts**: Recharts (LineChart)
- **PDF**: @react-pdf/renderer
- **Other**: Axios, emoji-picker-react, react-infinite-scroll-component, lodash

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express
- **Database**: MongoDB with Mongoose ODM (14 models)
- **Authentication**: JWT (access + refresh tokens), bcrypt
- **Real-time**: Socket.io
- **File Storage**: Cloudinary (images/avatars/media), MongoDB GridFS (resume PDFs)
- **Validation**: Zod (9 schemas)
- **Scheduling**: node-cron
- **Other**: cors, cookie-parser, multer, http-status

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB instance (local via Docker or cloud)

### Installation

#### 1. Clone the repository

```bash
git clone git@github.com:aadityasingh9601/LinkedIn-clone.git
cd LinkedIn-clone
```

#### 2. Setup Backend

```bash
cd Backend
npm install
```

- Copy `.env.example` to `.env` and fill in your environment variables (MongoDB URL, JWT secrets, Cloudinary keys, frontend URL).

#### 3. Setup Frontend

```bash
cd ../Frontend
npm install
```

- Copy `.env.example` to `.env` and set `VITE_BACKEND_URL` (defaults to `http://localhost:8000`).

### Running the Application

#### Start MongoDB (Docker)

```bash
cd Backend
npm run start-db
```

#### Start the Backend

```bash
cd Backend
npm run dev
```

#### Start the Frontend

```bash
cd ../Frontend
npm run dev
```

- The frontend runs on http://localhost:5173
- The backend runs on http://localhost:8000

#### Seed the Database (optional)

```bash
cd Backend
npm run db-seed
```

## Folder Structure

```
LinkedIn-clone/
├── Backend/
│   ├── server.js                    # Entry point — Express + Socket.io setup
│   ├── package.json
│   ├── .env.example
│   ├── docker-compose-dev.yml       # MongoDB 6.0 local container
│   ├── cloud/
│   │   └── cloudConfig.js           # Cloudinary config + multer upload middleware
│   ├── controllers/                 # 13 controllers (auth, profile, post, comment, like, follow, connection, chat, notification, job, application, analytic, poll)
│   ├── models/                      # 14 Mongoose models (User, Profile, Post, Comment, Like, Follow, Connection, Chat, Message, Notification, Job, Application, Poll, Analytics)
│   ├── routes/                      # 12 route files
│   ├── schedulers/
│   │   └── publishScheduledPosts.js # Cron job for scheduled posts
│   ├── utils/
│   │   ├── Token.js                 # JWT token generation
│   │   ├── gridfsStorage.js         # Custom GridFS multer storage
│   │   ├── helper.js                # Date utilities
│   │   ├── wrapAsync.js             # Async error wrapper
│   │   ├── Middlewares/
│   │   │   └── Middleware.js        # JWT auth middleware
│   │   └── seed-db/
│   │       └── mockData.js          # Database seeder
│   └── zodSchema/
│       └── index.js                 # Zod validation schemas
│
└── Frontend/
    ├── package.json
    ├── .env.example
    ├── vite.config.js
    ├── vercel.json
    ├── eslint.config.js
    ├── index.html
    └── src/
        ├── main.jsx                 # React entry point
        ├── App.jsx                  # Root component + routing
        ├── pages/                   # 9 page-level route components
        │   ├── Prelogin/
        │   ├── Auth/ (Login, Signup)
        │   ├── Home/
        │   ├── Profile/
        │   ├── Network/
        │   ├── Jobs/
        │   ├── Analytics/
        │   └── Notifications/
        ├── components/
        │   ├── Posts/               # Post, PostForm, CommentSection, ScheduledPosts, etc.
        │   ├── Polls/               # Poll, PollForm, PollOption
        │   ├── Messaging/           # ChatUI, ChatList, Chat, Message, MsgBox
        │   ├── Jobs/                # Job, JobForm, JobDetail, Application*, etc.
        │   ├── Profile/             # ProfileHeader, SkillsSection, EducationSection, ExperienceSection, Pdf, etc.
        │   ├── Notifications/       # Notification
        │   └── shared-components/   # Layouts, Routes, Modal, Button, Inputs, Icons, Loaders, Charts, etc.
        ├── stores/                  # 12 Zustand stores
        ├── hooks/                   # useSocket, useComponentVisible
        ├── utils/                   # API helpers, Axios instance, Socket.io client
        └── zodSchema/               # Zod validation schemas
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Disclaimer

This is a personal portfolio project built for learning purposes only.
Not affiliated with or endorsed by LinkedIn Corporation.
All LinkedIn trademarks and logos belong to LinkedIn Corporation.

## License

[ISC](LICENSE)
