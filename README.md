# 🚀 Collaborative Cloud Code Editor

A powerful, real-time collaborative code editor built for teams. Write, compile, and chat in sync with a modern, high-performance interface.

![Project Preview](https://via.placeholder.com/1200x600/0f172a/ffffff?text=Cloud+Editor+Preview)

## ✨ Features

- **Real-time Collaboration**: Powered by **Yjs** and **Liveblocks**, experience sub-100ms synchronization across multiple users.
- **Advanced Editor**: Integrated with **Monaco Editor** (the engine behind VS Code), providing syntax highlighting, IntelliSense, and multi-cursor support.
- **Persistent Rooms**: Create and manage persistent workspace rooms. Your code is always where you left it.
- **Integrated Chat**: Communicate with your team directly within the editor workspace.
- **File Management**: Full-featured file tree to organize your project structures.
- **Code Execution**: Run your code snippets directly from the browser using our integrated backend runner.
- **Secure Authentication**: Robust user management system with JWT-based sessions.
- **Modern UI/UX**: Stunning dark-themed interface built with **Tailwind CSS 4.0** and **Framer Motion**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Collaboration**: [Liveblocks](https://liveblocks.io/) & [Yjs](https://yjs.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Authentication**: [JWT](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Real-time**: [WebSockets](https://github.com/websockets/ws) & [Liveblocks Node SDK](https://liveblocks.io/docs/api-reference/node-sdk)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Atlas account
- Liveblocks account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/code-editor.git
cd code-editor
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend/code-editor
npm install
```
Create a `.env` file in the `frontend/code-editor` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
```
Start the frontend:
```bash
npm run dev
```

---

## 📂 Project Structure

```text
code-editor/
├── backend/                # Express.js Server
│   ├── src/
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API Endpoints (Auth, Room, Run)
│   │   └── index.ts       # Server entry point
│   └── ...
└── frontend/               # React Client
    ├── src/
    │   ├── components/    # Reusable UI components (Editor, Chat, FileTree)
    │   ├── pages/         # View components (Landing, Dashboard, Editor)
    │   └── main.tsx       # App entry point
    └── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ by the team</p>
