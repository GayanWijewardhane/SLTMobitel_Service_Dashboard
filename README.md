# Service Request Dashboard - MERN Stack

A modern, secure service request management system built with the MERN stack (MongoDB, Express.js, React, Node.js) and Material-UI.

## 🚀 Features

- *Modern UI*: Built with Material-UI (MUI) for a professional look
- *Secure Authentication*: JWT-based authentication with account lockout protection
- *Dashboard Analytics*: Real-time statistics and data visualization
- *CRUD Operations*: Complete service request management
- *File Upload*: RCA file upload and management
- *Data Export*: CSV export functionality
- *Responsive Design*: Works on all device sizes
- *Search & Filter*: Advanced filtering and search capabilities
- *Pagination*: Efficient data handling with pagination

## 🛠 Technology Stack

### Backend
- *Node.js* - Runtime environment
- *Express.js* - Web framework
- *MongoDB* - Database
- *Mongoose* - MongoDB ODM
- *JWT* - Authentication
- *bcryptjs* - Password hashing
- *Multer* - File upload handling
- *Helmet* - Security middleware

### Frontend
- *React 18* - UI library
- *Material-UI (MUI)* - Component library
- *React Router* - Client-side routing
- *Axios* - HTTP client
- *Day.js* - Date manipulation
- *React Hot Toast* - Notifications

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB 4.4 or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Setup

bash
# Navigate to your project directory
cd /path/to/your/project

# Make deployment script executable
chmod +x deploy.sh

# Run automated deployment
./deploy.sh


### 2. Manual Installation (Alternative)

bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Go back to root
cd ..


### 3. Environment Configuration

Update server/.env with your configuration:

env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/serviceDashboardDB

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h

# Client URL
CLIENT_URL=http://172.22.97.21:5173


### 4. Database Setup

bash
# Start MongoDB service
sudo systemctl start mongod

# Seed database with default users
npm run seed


### 5. Start the Application

bash
# Development mode (both frontend and backend)
npm run dev

# Production mode
npm start


## 👥 Default User Accounts

After seeding the database, you can login with:

| Username | Password | Role |
|----------|----------|------|
| ns6 | 1qaz!QAZ | Admin |
| mobitel | 1qaz!QAZ | User |
| huawei | 1qaz!QAZ | User |

## 📁 Project Structure


sr-dashboard-mern/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── scripts/           # Utility scripts
├── uploads/               # File upload directory
└── package.json           # Root package.json


## 🔧 Available Scripts

### Root Level
- npm run dev - Start both frontend and backend in development mode
- npm start - Start in production mode
- npm run install:all - Install all dependencies
- npm run seed - Seed database with default users

### Frontend (client/)
- npm run dev - Start React development server
- npm run build - Build for production
- npm run preview - Preview production build

### Backend (server/)
- npm run dev - Start with nodemon (development)
- npm start - Start in production mode
- npm run seed - Seed database

## 🔒 Security Features

- JWT token-based authentication
- HTTP-only cookies for token storage
- Account lockout after failed login attempts
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- Helmet.js for security headers
- CORS configuration

## 📊 API Endpoints

### Authentication
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user
- PUT /api/auth/change-password - Change password

### Service Requests
- GET /api/requests - Get all requests (with pagination/filtering)
- GET /api/requests/:id - Get single request
- POST /api/requests - Create new request
- PUT /api/requests/:id - Update request
- DELETE /api/requests/:id - Delete request
- GET /api/requests/stats - Get dashboard statistics
- GET /api/requests/export - Export requests to CSV
- POST /api/requests/upload-rca - Upload RCA file

## 🚀 Deployment

### Development Deployment
bash
npm run dev

Access at: http://172.22.97.21:5173

### Production Deployment
bash
npm run client:build
npm run production

Access at: http://172.22.97.21:5001

## 🔧 Configuration

### MongoDB Configuration
Ensure MongoDB is running:
bash
sudo systemctl start mongod
sudo systemctl enable mongod


### Port Configuration
- Backend: Port 5001 (configurable via .env)
- Frontend Dev Server: Port 5173
- MongoDB: Port 27017 (default)

### File Upload Configuration
- Upload directory: ./uploads
- Maximum file size: 10MB
- Allowed file types: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, XLSX, XLS

## 🐛 Troubleshooting

### Common Issues

1. *MongoDB Connection Error*
   bash
   sudo systemctl start mongod
   

2. *Port Already in Use*
   bash
   lsof -ti:5001 | xargs kill -9
   

3. *Permission Denied on Uploads*
   bash
   chmod 755 uploads
   

4. *Module Not Found Errors*
   bash
   npm run install:all
   

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team.
