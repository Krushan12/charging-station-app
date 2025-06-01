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


## 📚 API Documentation with Postman Examples

### Authentication Endpoints

1. **Register User**
```json
POST /api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}

// Success Response (201 Created)
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
        "id": "user_id",
        "username": "testuser",
        "email": "test@example.com"
    }
}
```

2. **Login User**
```json
POST /api/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}

// Success Response (200 OK)
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
        "id": "user_id",
        "email": "test@example.com",
        "username": "testuser"
    }
}
```

### Charging Station Endpoints

1. **Create Charging Station**
```json
POST /api/charging-stations
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Test Charger",
    "location": {
        "type": "Point",
        "coordinates": [72.8311, 21.1702]
    },
    "status": "active",
    "powerOutput": 50,
    "connectorType": "Level 2"
}

// Success Response (201 Created)
{
    "success": true,
    "data": {
        "_id": "station_id",
        "name": "Test Charger",
        "location": {
            "type": "Point",
            "coordinates": [72.8311, 21.1702]
        },
        "status": "active",
        "powerOutput": 50,
        "connectorType": "Level 2",
        "createdAt": "2023-12-21T12:00:00.000Z"
    }
}
```

2. **Update Charging Station**
```json
PUT /api/charging-stations/{station_id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Updated Charger Name",
    "location": {
        "type": "Point",
        "coordinates": [72.8311, 21.1702]
    },
    "status": "inactive",
    "powerOutput": 75,
    "connectorType": "Level 2"
}

// Success Response (200 OK)
{
    "success": true,
    "data": {
        "_id": "station_id",
        "name": "Updated Charger Name",
        "location": {
            "type": "Point",
            "coordinates": [72.8311, 21.1702]
        },
        "status": "inactive",
        "powerOutput": 75,
        "connectorType": "Level 2",
        "updatedAt": "2023-12-21T12:00:00.000Z"
    }
}

```

3. **Get All Charging Stations**
```json
GET /api/charging-stations
Authorization: Bearer {token}

// Optional Query Parameters:
?status=active
&connectorType=Level 2
&powerOutput=50

// Success Response (200 OK)
{
    "success": true,
    "count": 1,
    "data": [
        {
            "_id": "station_id",
            "name": "Test Charger",
            "location": {
                "type": "Point",
                "coordinates": [72.8311, 21.1702]
            },
            "status": "active",
            "powerOutput": 50,
            "connectorType": "Level 2"
        }
    ]
}
```

4. **Delete Charging Station**
```json
DELETE /api/charging-stations/{station_id}
Authorization: Bearer {token}

// Success Response (200 OK)
{
    "success": true,
    "data": {}
}
```

### Important Notes:

1. **Authentication**:
   - All charging station endpoints require JWT token in Authorization header
   - Token format: `Bearer eyJhbGciOiJIUzI1NiIs...`
   - Token is obtained from login/register response

2. **Required Fields**:
   - For POST and PUT requests, all fields are required:
     - name (string)
     - location.coordinates (array of [longitude, latitude])
     - status (string: "active" or "inactive")
     - powerOutput (number)
     - connectorType (string: "Level 1", "Level 2", or "DC Fast")

3. **Error Handling**:
   - 400: Bad Request (Invalid data or missing fields)
   - 401: Unauthorized (Missing or invalid token)
   - 404: Not Found (Invalid station ID)
   - 500: Server Error

### 📸 Postman API Examples

Here are some example screenshots of API requests made in Postman:

#### Authentication

1. **Register New User**
![Register API](https://github.com/krushant/charging-station-app/assets/screenshots/POST_Register.png)

2. **Login User**
![Login API](https://github.com/krushant/charging-station-app/assets/screenshots/POST_Login.png)

#### Charging Stations

1. **List All Charging Stations**
![Get Chargers API](https://github.com/krushant/charging-station-app/assets/screenshots/GET_Read.png)

2. **Create New Charging Station**
![Create Charger API](https://github.com/krushant/charging-station-app/assets/screenshots/Post_ChargerStation.png)

3. **Update Charging Station**
![Update Charger API](https://github.com/krushant/charging-station-app/assets/screenshots/POST_Update.png)

Note: Make sure to include the Authorization token in the headers for all charging station endpoints.


