<div align="center">

# 🎬 Play

### A full-stack video sharing platform inspired by YouTube

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **User Authentication** | Secure sign-up, login, and JWT-based session management |
| 🎥 **Video Upload & Management** | Upload, edit, and delete videos via Cloudinary |
| 📂 **Playlists** | Create and manage personal video playlists |
| 📜 **Watch History** | Automatically tracks your viewing activity |
| ❤️ **Liked Videos** | Save and revisit your favourite content |
| 🔔 **Subscriptions & Notifications** | Subscribe to channels and get notified on new uploads |
| 📝 **Community Posts** | Share updates and engage with your audience |
| 📊 **Dashboard Analytics** | Creators can monitor views, likes, and subscriber growth |
| 🙍 **Profile Management** | Edit avatars, bios, and account details |
| 🔍 **Search** | Find videos and channels instantly |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — component-based UI
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — smooth animations
- **Axios** — HTTP client

### Backend
- **Node.js** + **Express.js** — RESTful API server
- **MongoDB** — NoSQL database
- **JWT** — stateless authentication
- **Cloudinary** — cloud media storage

---

## 📁 Project Structure

```
play/
├── client/          # React frontend
└── server/          # Express backend
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

**1. Clone the repository**

```bash
git clone <repo-url>
cd play
```

**2. Set up the client**

```bash
cd client
npm install
```

**3. Set up the server**

```bash
cd ../server
npm install
```

**4. Configure environment variables**

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file inside `/client`:

```env
VITE_API_URL=http://localhost:5000
```

**5. Run the app**

```bash
# In /server
npm run dev

# In /client (separate terminal)
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:5000`.

---
