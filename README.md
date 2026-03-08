# Miro - Whiteboard Application

A full-stack web whiteboard application built with modern technologies. This project was developed as a coursework submission for the Internet Engineering subject.

## 📋 Project Overview

Miro is a collaborative(although collaboration has not yet been implemented) digital whiteboard application that allows users to create, edit, and manage drawing boards with various shape elements. Users can sign up, create multiple boards (grids), and add interactive elements like rectangles, circles, lines, and text to their boards.

## 🛠 Technologies Used

### Frontend

- **React Native 0.81.5** - Cross-platform mobile framework
- **Expo 54.0** - Development platform and build system
- **TypeScript 5.9** - Type-safe JavaScript

### Backend

- **Django 4.x** - Python web framework
- **Django Rest Framework** - REST API development
- **JWT (JSON Web Token)** - Secure authentication
- **SQLite** - Lightweight database

## 🎯 Project Architecture

### Directory Structure

```
Miro/
├── src/
│   ├── frontend/
│   │   ├── app/                    # React Native app (routes)
│   │   ├── components/             # Reusable UI components
│   │   │   ├── elements_render/   # Shape rendering (circle, rectangle, line, text)
│   │   │   ├── grid/              # Grid management logic
│   │   │   ├── resize/            # Element resize functionality
│   │   │   └── [various UI components]
│   │   ├── assets/                 # Images and static resources
│   │   └── public/                 # Web assets
│   ├── backend/                    # Django project
│   │   ├── api/                    # REST API endpoints
│   │   │   ├── models.py          # Database models (User, Grid, GridElement)
│   │   │   ├── serializers.py     # Data serialization
│   │   │   ├── views.py           # API view logic
│   │   │   ├── urls.py            # URL routing
│   │   │   ├── authenticate.py    # JWT authentication
│   │   │   └── migrations/        # Database migrations
│   │   ├── backend/               # Django settings
│   │   │   ├── settings.py        # Configuration
│   │   │   ├── urls.py            # URL configuration
│   │   │   ├── wsgi.py            # WSGI application
│   │   │   └── asgi.py            # ASGI application
│   │   ├── db.sqlite3             # Development database
│   │   └── manage.py              # Django management CLI
│   └── config files (babel, webpack, tsconfig, etc.)
└── README.md
```

## 🚀 Getting Started

### Frontend Setup

1. Navigate to the `src` directory:

```bash
cd src
```

2. Install dependencies:

```bash
npm install
```

3. Start the Expo development server:

```bash
npm start
# or for specific platforms:
npm run android    # Start Android emulator
npm run ios        # Start iOS simulator
npm run web        # Start web browser
```

The frontend will be available at `http://localhost:8081` (web) or via the Expo app on mobile devices.

### Backend Setup

1. Navigate to the `src/backend` directory:

```bash
cd src/backend
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Apply database migrations:

```bash
python manage.py migrate
```

4. Create a superuser (optional, for Django admin):

```bash
python manage.py createsuperuser
```

5. Start the Django development server:

```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`.

## 🔐 Authentication System

The application uses **JWT (JSON Web Token)** for secure authentication:

### Authentication Endpoints

| Method | Endpoint              | Description                | Parameters                      |
| :----- | :-------------------- | :------------------------- | :------------------------------ |
| POST   | `/api/register/`      | Register new user          | `username`, `password`, `email` |
| POST   | `/api/login/`         | User login, receive tokens | `username`, `password`          |
| POST   | `/api/logout/`        | User logout                | `{}` (empty body)               |
| POST   | `/api/token/refresh/` | Refresh access token       | `refresh` (refresh token)       |

**Authorization Header** (required for protected endpoints):

```
Authorization: Bearer <access_token>
```

## 📊 API Documentation

### Grid Management (Whiteboard Boards)

| Method | Endpoint                  | Description            | Notes                           |
| :----- | :------------------------ | :--------------------- | :------------------------------ |
| GET    | `/api/grids/`             | List all user's boards | Returns boards without elements |
| POST   | `/api/grids/create/`      | Create new board       | Required: `name` field          |
| GET    | `/api/grids/<pk>/`        | Get board details      | Includes all elements           |
| PATCH  | `/api/grids/<pk>/update/` | Update board info      | E.g., rename board              |
| DELETE | `/api/grids/<pk>/delete/` | Delete board           | Cascades delete to elements     |

### Board Elements (Shapes)

| Method | Endpoint                             | Description          | Parameters                             |
| :----- | :----------------------------------- | :------------------- | :------------------------------------- |
| POST   | `/api/grids/<grid_id>/elements/add/` | Add element to board | `element_type`, `x`, `y`, `properties` |
| PATCH  | `/api/elements/<pk>/update/`         | Update element       | `x`, `y`, `properties`                 |
| DELETE | `/api/elements/<pk>/delete/`         | Remove element       | Deletes from board                     |

### Supported Element Types

- **Rectangle** - Customizable rectangles with position and dimensions
- **Circle** - Circular shapes with configurable radius
- **Line** - Straight lines with start and end points
- **Text** - Text elements with content and styling

## 🎨 Key Features

### Frontend Features

- **Multi-platform Support** - Works on iOS, Android, and Web
- **User Authentication** - Secure login/registration
- **Multiple Boards** - Create and manage multiple drawing boards
- **Shape Tools** - Rectangle, circle, line, and text elements
- **Shape Editing** - Move and resize elements dynamically
- **Responsive UI** - Adapts to different screen sizes
- **Color Picker** - Customize shape colors

### Backend Features

- **User Management** - Registration, login, user profiles
- **Board Management** - Create, read, update, delete boards
- **Element Management** - Add, modify, remove shapes
- **Secure API** - JWT-based authentication
- **Data Persistence** - SQLite database storage
- **API Documentation** - RESTful API with clear endpoints

## 📱 How to Use

1. **Register/Login**: Create a new account or log in with existing credentials
2. **Create Board**: Create a new whiteboard board to start drawing
3. **Add Elements**: Select a shape tool and click to add shapes to the board
4. **Edit Elements**: Move, resize, and customize shapes as needed
5. **Manage Boards**: View, update, or delete your boards
6. **Save Automatically**: Changes are persisted to the backend

## 📚 Course Information

This project was developed as coursework for the **Internet Engineering** subject, demonstrating full-stack development skills including:

- Modern frontend frameworks and mobile development
- Backend API design and database management
- User authentication and security
- Cross-platform application development
- REST API design principles
