# EV Charger Manager

A full-stack application for managing EV charging stations with real-time map visualization.

## 🚀 Live Demo

- Frontend: https://charging-station-app.vercel.app
- Backend API: https://charging-station-app.onrender.com/api

## ✨ Features

### Backend
- RESTful API built with Node.js and Express
- MongoDB database for data persistence
- JWT-based authentication
- Protected routes for charging station management
- CRUD operations for charging stations
- Location-based charger search

### Frontend
- Modern UI built with Vue 3 and Vite
- Real-time map visualization using OpenStreetMap
- Advanced filtering capabilities
- Responsive design for mobile and desktop
- JWT authentication with secure storage
- Interactive charger management interface

### Charging Station Features
- Name and location tracking
- Status monitoring (Active/Inactive)
- Power output management
- Connector type categorization
- Geographic coordinates support
- Real-time status updates

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose ODM
- Express Validator

### Frontend
- Vue.js 3
- Pinia (State Management)
- Vue Router
- Leaflet Maps
- Axios
- Vite

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with following variables
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

# Start development server
npm run dev

# Start production server
npm start
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file for development
echo "VITE_BACKEND_API_URL=http://localhost:5000" > .env.development

# Create .env file for production
echo "VITE_BACKEND_API_URL=https://charging-station-app.onrender.com" > .env.production

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔒 API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Charging Stations (Protected Routes)
- GET /api/charging-stations - List all stations
- POST /api/charging-stations - Create new station
- GET /api/charging-stations/:id - Get single station
- PUT /api/charging-stations/:id - Update station
- DELETE /api/charging-stations/:id - Delete station

## 📱 Features Demonstrated

1. **Authentication & Authorization**
   - JWT-based secure authentication
   - Protected routes
   - Session management

2. **Charging Station Management**
   - CRUD operations
   - Real-time status updates
   - Location tracking
   - Power output monitoring

3. **Map Integration**
   - OpenStreetMap integration
   - Interactive markers
   - Location search
   - Charger details on click

4. **Advanced Filtering**
   - Status filtering
   - Power output ranges
   - Connector type filtering
   

5. **Responsive Design**
   - Mobile-first approach
   - Adaptive layouts
   - Touch-friendly interfaces

## 🔐 Security Features

- JWT token authentication
- Protected API endpoints
- Secure password hashing
- Input validation
- CORS protection


## 👨‍💻 Developer

This project was developed as part of a 5-day full-stack development assignment, demonstrating proficiency in:
- Full-stack JavaScript development
- Modern frontend frameworks
- RESTful API design
- Database modeling
- Cloud deployment
- Security implementation
- Map integration
- Responsive design


