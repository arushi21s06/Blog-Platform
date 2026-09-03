# 📝 Blogify

### ✨ A Modern Full-Stack Blogging Platform

Blogify is a modern and interactive blogging platform where users can **create, edit, delete, and share blog posts** and interact with other users through comments.

Built with a clean vanilla frontend and a powerful Node.js backend, Blogify combines a smooth user experience with secure authentication and MongoDB database integration.

---

## 🌐 Live Preview

🚀 **Live Demo:** https://blogify-gold-two.vercel.app/

---

## ✨ Features

### 🔐 Authentication
- 👤 User registration
- 🔑 Secure login
- 🛡️ JWT-based authentication
- 🚪 Logout functionality
- 🔒 Protected post and comment actions

### 📝 Blog Posts
- ➕ Create new posts
- ✏️ Edit your posts
- 🗑️ Delete your posts
- 📖 View all published posts
- 👤 Display post authors
- 🕒 Display publication dates

### 💬 Comments
- 💭 Add comments to posts
- 👀 View comments
- 🗑️ Delete your own comments
- 👤 Display comment authors

### 🎨 Modern UI
- 🌙 Dark mode
- ☀️ Light mode
- 💾 Theme preference persistence
- ✨ Animated background effects
- 🪄 Glassmorphism design
- 🎯 Interactive hover effects
- 📱 Responsive design
- ⚡ Smooth transitions and animations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| 🌐 HTML5 | Website structure |
| 🎨 CSS3 | Styling, animations & responsive UI |
| ⚡ JavaScript | Frontend interactivity |
| 🟢 Node.js | Backend runtime |
| 🚂 Express.js | REST API |
| 🍃 MongoDB | Database |
| 🦫 Mongoose | MongoDB object modeling |
| 🔐 JWT | Authentication |
| 🔑 bcrypt | Password hashing |

---

## 🏗️ Project Structure

```text
Blogify/
│
├── 📁 public/
│   ├── 📄 index.html
│   ├── 📄 login.html
│   ├── 📄 register.html
│   │
│   ├── 📁 css/
│   │   └── 🎨 style.css
│   │
│   └── 📁 js/
│       ├── ⚡ app.js
│       ├── 🔐 auth.js
│       └── 📜 script.js
│
├── 📁 server/
│   │
│   ├── 📁 controllers/
│   │   ├── 🔐 authController.js
│   │   ├── 📝 postController.js
│   │   └── 💬 commentController.js
│   │
│   ├── 📁 models/
│   │   ├── 👤 User.js
│   │   ├── 📝 Post.js
│   │   └── 💬 Comment.js
│   │
│   ├── 📁 routes/
│   │   ├── 🔐 authRoutes.js
│   │   ├── 📝 postRoutes.js
│   │   └── 💬 commentRoutes.js
│   │
│   ├── 📁 middleware/
│   │   └── 🛡️ auth.js
│   │
│   └── 🚀 server.js
│
├── 📄 package.json
├── 📄 package-lock.json
└── 📄 README.md
