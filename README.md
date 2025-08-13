# 🌱 GreenCart Logistics

A comprehensive logistics management system for efficient supply chain operations and delivery tracking.

## 🚀 Live Demo

- **Frontend**: [https://greencart-logistics-eight.vercel.app](https://greencart-logistics-eight.vercel.app/login)
- **Backend API**: [https://greencart-backend-tg6w.onrender.com](https://greencart-backend-tg6w.onrender.com)

## 📋 Project Overview

GreenCart Logistics streamlines logistics operations with features including:

- 🔐 JWT-based authentication with role management
- 📊 Real-time dashboard and analytics
- 👥 Driver management and shift tracking
- 🛣️ Route optimization and traffic monitoring
- 📦 Inventory and order management
- 🚚 Delivery tracking system
- 📱 Responsive design

## 🛠️ Tech Stack

**Frontend**: React.js, Tailwind CSS, React Router, Axios  
 **Backend**: Node.js, Express.js, JWT Authentication  
 **Database**: MongoDB Atlas  
 **Deployment**: Vercel (Frontend), Render (Backend)

## ⚙️ Setup Instructions

### Backend Setup

```bash
git clone https://github.com/yourusername/greencart-logistics.git
cd greencart-logistics/backend
npm install
# Configure .env file (see Environment Variables)
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
# Configure .env.local file
npm start
```

### Demo Credentials

- **Email**: manager@greencart.com
- **Password**: manager123

## 🔧 Environment Variables

### Backend (.env)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)

```env
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

## 🚀 Deployment

### MongoDB Atlas

1.  Create cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
2.  Create database user and get connection string
3.  Add `0.0.0.0/0` to IP whitelist

### Backend (Render)

1.  Connect GitHub repo to [Render](https://render.com)
2.  Set Root Directory: `backend`
3.  Build Command: `npm install`
4.  Start Command: `npm start`
5.  Add environment variables

### Frontend (Vercel)

1.  Import repo to [Vercel](https://vercel.com)
2.  Set Root Directory: `frontend`
3.  Add environment variables
4.  Update backend CORS with Vercel URL

## 📚 API Documentation

**Base URL**:

- Development: `http://localhost:5000/api`
- Production: `https://greencart-backend-tg6w.onrender.com/api`

### 🔐 Authentication Endpoints

#### 1. Register User

**Endpoint**: `POST /api/auth/register`  
 **Description**: Create a new user account

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "manager"
}
```

**Success Response (201)**:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "newuser@example.com",
  "role": "manager",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:

```json
// 400 - Bad Request
{
  "error": "Email and password are required"
}

// 400 - User Exists
{
  "error": "User already exists"
}
```

#### 2. Login User

**Endpoint**: `POST /api/auth/login`  
 **Description**: Authenticate user and get access token

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "manager@greencart.com",
  "password": "manager123"
}
```

**Success Response (200)**:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "manager@greencart.com",
  "role": "manager",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:

```json
// 401 - Invalid Credentials
{
  "error": "Invalid credentials"
}
```

### 🚚 Drivers Endpoints

#### 1. Get All Drivers

**Endpoint**: `GET /api/drivers`  
 **Description**: Retrieve all drivers

**Request Headers**:

```
Authorization: Bearer <token>
```

**Success Response (200)**:

```json
[
  {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "currentShiftHours": 8,
    "pastWeekHours": [8, 7, 6, 5, 8, 0, 0],
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z"
  },
  {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
    "name": "Jane Smith",
    "currentShiftHours": 6,
    "pastWeekHours": [7, 8, 7, 6, 5, 0, 0],
    "isActive": true,
    "createdAt": "2024-01-11T09:00:00.000Z",
    "updatedAt": "2024-01-11T09:00:00.000Z"
  }
]
```

#### 2. Create Driver

**Endpoint**: `POST /api/drivers`  
 **Description**: Add a new driver

**Request Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Mike Johnson",
  "currentShiftHours": 7,
  "pastWeekHours": [7, 8, 7, 6, 5, 0, 0],
  "isActive": true
}
```

**Success Response (201)**:

```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d2",
  "name": "Mike Johnson",
  "currentShiftHours": 7,
  "pastWeekHours": [7, 8, 7, 6, 5, 0, 0],
  "isActive": true,
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

#### 3. Update Driver

**Endpoint**: `PUT /api/drivers/:id`  
 **Description**: Update driver details by ID

**Request Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Mike Johnson Sr.",
  "currentShiftHours": 8,
  "pastWeekHours": [8, 8, 7, 7, 6, 0, 0],
  "isActive": false
}
```

**Success Response (200)**:

```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d2",
  "name": "Mike Johnson Sr.",
  "currentShiftHours": 8,
  "pastWeekHours": [8, 8, 7, 7, 6, 0, 0],
  "isActive": false,
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-16T10:00:00.000Z"
}
```

#### 4. Delete Driver

**Endpoint**: `DELETE /api/drivers/:id`  
 **Description**: Remove driver by ID

**Request Headers**:

```
Authorization: Bearer <token>
```

**Success Response (200)**:

```json
{
  "message": "Driver deleted successfully"
}
```

**Error Response (404)**:

```json
{
  "error": "Driver not found"
}
```

### 🛣️ Routes Endpoints

#### 1. Get All Routes

**Endpoint**: `GET /api/routes`  
 **Description**: Retrieve all routes

**Request Headers**:

```
Authorization: Bearer <token>
```

**Success Response (200)**:

```json
[
  {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d3",
    "routeId": "R001",
    "distanceKm": 12.5,
    "trafficLevel": "Medium",
    "baseTimeMin": 30,
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z"
  },
  {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d4",
    "routeId": "R002",
    "distanceKm": 8.3,
    "trafficLevel": "Low",
    "baseTimeMin": 20,
    "isActive": true,
    "createdAt": "2024-01-11T08:00:00.000Z",
    "updatedAt": "2024-01-11T08:00:00.000Z"
  }
]
```

#### 2. Create Route

**Endpoint**: `POST /api/routes`  
 **Description**: Add a new route

**Request Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "routeId": "R005",
  "distanceKm": 10.2,
  "trafficLevel": "Low",
  "baseTimeMin": 25,
  "isActive": true
}
```

**Success Response (201)**:

```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d5",
  "routeId": "R005",
  "distanceKm": 10.2,
  "trafficLevel": "Low",
  "baseTimeMin": 25,
  "isActive": true,
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

#### 3. Update Route

**Endpoint**: `PUT /api/routes/:id`  
 **Description**: Update route details by ID

**Request Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:

```json
{
  "routeId": "R005",
  "distanceKm": 11.0,
  "trafficLevel": "High",
  "baseTimeMin": 28,
  "isActive": false
}
```

**Success Response (200)**:

```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d5",
  "routeId": "R005",
  "distanceKm": 11.0,
  "trafficLevel": "High",
  "baseTimeMin": 28,
  "isActive": false,
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-16T10:00:00.000Z"
}
```

#### 4. Delete Route

**Endpoint**: `DELETE /api/routes/:id`  
 **Description**: Remove route by ID

**Request Headers**:

```
Authorization: Bearer <token>
```

**Success Response (200)**:

```json
{
  "message": "Route deleted successfully"
}
```

**Error Response (404)**:

```json
{
  "error": "Route not found"
}
```

### 🏥 System Endpoints

#### Health Check

**Endpoint**: `GET /api/health`  
 **Description**: Check API and database status

**Request Headers**: None required

**Success Response (200)**:

```json
{
  "status": "OK",
  "database": "Connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 🔧 How to Use in Postman

#### Setup Postman Environment

1.  **Create New Environment**:
    - Name: `GreenCart Logistics`
    - Variables:
      - `base_url`: `https://greencart-backend-tg6w.onrender.com/api`
      - `token`: (leave empty, will be set after login)

#### Step-by-Step API Testing:

**Step 1: Test Health Check**

- Method: `GET`
- URL: `{{base_url}}/health`
- Expected: Status 200 with health status

**Step 2: Login to Get Token**

- Method: `POST`
- URL: `{{base_url}}/auth/login`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "email": "manager@greencart.com",
    "password": "manager123"
  }
  ```
- Expected: Status 200 with token
- **Copy the token to use in protected routes**

**Step 3: Test Drivers API**

- **Get All Drivers**:

  - Method: `GET`
  - URL: `{{base_url}}/drivers`
  - Headers: `Authorization: Bearer {{token}}`

- **Create Driver**:
  - Method: `POST`
  - URL: `{{base_url}}/drivers`
  - Headers: `Authorization: Bearer {{token}}`, `Content-Type: application/json`
  - Body:
    ```json
    {
      "name": "Test Driver",
      "currentShiftHours": 8,
      "pastWeekHours": [8, 7, 6, 5, 8, 0, 0],
      "isActive": true
    }
    ```

**Step 4: Test Routes API**

- **Get All Routes**:

  - Method: `GET`
  - URL: `{{base_url}}/routes`
  - Headers: `Authorization: Bearer {{token}}`

- **Create Route**:
  - Method: `POST`
  - URL: `{{base_url}}/routes`
  - Headers: `Authorization: Bearer {{token}}`, `Content-Type: application/json`
  - Body:
    ```json
    {
      "routeId": "R999",
      "distanceKm": 15.5,
      "trafficLevel": "Medium",
      "baseTimeMin": 35,
      "isActive": true
    }
    ```

### 🧪 Testing Scenarios

**Authentication Flow**:

1.  Register new user → Get token
2.  Login with credentials → Get token
3.  Access protected routes with token
4.  Try accessing without token → Should get 401

**Driver Management**:

1.  Get all drivers → Should return array
2.  Create new driver → Should return created driver
3.  Update driver by ID → Should return updated driver
4.  Delete driver by ID → Should return success message

**Route Management**:

1.  Get all routes → Should return array
2.  Create new route → Should return created route
3.  Update route by ID → Should return updated route
4.  Delete route by ID → Should return success message

## 🤝 Contributing

1.  Fork the repository
2.  Create feature branch: `git checkout -b feature/new-feature`
3.  Commit changes: `git commit -m 'Add new feature'`
4.  Push to branch: `git push origin feature/new-feature`
5.  Open Pull Request

---

⭐ **Star this repo if you found it helpful!**
