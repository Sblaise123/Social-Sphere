# Social-Sphere
A full-stack social media mock app with user authentication, posts, likes, and comments. Django REST API powers the backend; React frontend provides dynamic UI. Containerized with Docker for local testing and deployed on Vercel using a connected frontend-backend architecture.

🌐 SocialSphere - Full-Stack Social Media Platform

A modern, feature-rich social media application built with Django REST Framework and React.js.

## ✨ Features

- 👤 **User Authentication**: Register, login, logout with JWT tokens
- 📝 **Post Creation**: Create, edit, and delete posts with text and images
- ❤️ **Likes**: Like and unlike posts
- 💬 **Comments**: Comment on posts and view all comments
- 👥 **User Profiles**: View user profiles and their posts
- 🔍 **Feed**: Browse posts from all users
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Beautiful interface with TailwindCSS

## 🏗️ Architecture

```
socialsphere/
├── backend/                    # Django REST Framework API
│   ├── socialsphere/          # Project configuration
│   ├── accounts/              # User authentication & profiles
│   ├── posts/                 # Posts, likes, comments
│   ├── api/                   # API configuration
│   ├── media/                 # User uploaded files
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                   # React.js Application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── context/          # React Context (Auth)
│   │   ├── utils/            # Utility functions
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend dev)
- Python 3.10+ (for local backend dev)

### With Docker (Recommended)

1. **Clone the repository**
```bash
git clone 
cd socialsphere
```

2. **Create environment files**
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. **Start with Docker Compose**
```bash
docker-compose up --build
```

4. **Run migrations and create superuser**
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin
- API Documentation: http://localhost:8000/api/docs

### Without Docker

See [NO_DOCKER_SETUP.md](./NO_DOCKER_SETUP.md) for detailed instructions.

## 📋 Environment Variables

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://postgres:postgres@db:5432/socialsphere
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user
- `PUT /api/auth/user/` - Update profile

### Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/{id}/` - Get post details
- `PUT /api/posts/{id}/` - Update post
- `DELETE /api/posts/{id}/` - Delete post
- `POST /api/posts/{id}/like/` - Like/unlike post

### Comments
- `GET /api/posts/{id}/comments/` - List post comments
- `POST /api/posts/{id}/comments/` - Create comment
- `DELETE /api/comments/{id}/` - Delete comment

### Users
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user profile
- `GET /api/users/{id}/posts/` - Get user's posts

## 🧪 Testing

### Backend Tests
```bash
# With Docker
docker-compose exec backend python manage.py test

# Without Docker
cd backend
python manage.py test
```

### Frontend Tests
```bash
# With Docker
docker-compose exec frontend npm test
