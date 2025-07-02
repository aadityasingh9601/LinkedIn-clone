# LinkedIn Clone

A full-stack LinkedIn clone built with React (Vite) for the frontend and Node.js/Express with MongoDB for the backend. This project implements core social networking features such as posts, comments, likes, jobs, messaging, notifications, analytics, and more.

## Features

- **User Authentication**: Sign up, log in, and manage your profile.
- **Posts & Comments**: Create, edit, and comment on posts.
- **Likes & Polls**: Like posts and participate in polls.
- **Jobs**: Post jobs, apply for jobs, and view applications.
- **Messaging**: Real-time chat between users.
- **Notifications**: Get notified about important activities.
- **Network**: Connect and follow other users.
- **Analytics**: View analytics related to your activity.
- **Profile Management**: Add education, experience, and update your profile.
<!-- - **Responsive UI**: Modern, clean, and responsive user interface. -->

## Tech Stack

- **Frontend**: React, Vite, Zustand, React Hook Form, React Router, Recharts, React Toastify, Socket.io-client
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io, Cloudinary, JWT, Joi, Multer
- **Other**: ESLint, dotenv

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

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

- Create a `.env` file in the `Backend` directory with your environment variables (e.g., MongoDB URL, JWT secret, Cloudinary keys (See env file on backend)).

#### 3. Setup Frontend

```bash
cd ../Frontend
npm install
```

### Running the Application

#### Start the Backend

```bash
cd Backend
node server.js
```

#### Start the Frontend

```bash
cd ../Frontend
npm run dev
```

- The frontend will typically run on http://localhost:5173
- The backend will typically run on http://localhost:8000 (or as configured)

## Folder Structure

```
LinkedIn-clone/
  ├── Backend/    # Express API, models, controllers, routes
  └── Frontend/   # React app, components, assets, stores
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[ISC](LICENSE)