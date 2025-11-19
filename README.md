Node.js Authentication API with Express & MongoDB
A full-featured REST API built with Node.js, Express, and MongoDB featuring secure JWT authentication, user management, and CRUD operations for a blog-like post system.
## 🚀 Features
## Authentication & User Management

User Registration - Create new user accounts with email validation
User Login - Secure authentication with JWT tokens
Email Verification - Code-based email verification system
Password Management

Change password for authenticated users
Forgot password with email verification codes
Secure password hashing with bcryptjs


Protected Routes - Middleware-based route protection

## Post Management (CRUD Operations)

Create Posts - Authenticated users can create posts
Read Posts - Retrieve all posts with pagination
Update Posts - Edit existing posts (coming soon)
Delete Posts - Remove posts (coming soon)

## Technologies Used

Node.js - JavaScript runtime
Express.js - Web application framework
MongoDB - NoSQL database
Mongoose - MongoDB object modeling
JWT (jsonwebtoken) - Secure token-based authentication
bcryptjs - Password hashing
Nodemailer - Email sending functionality
Joi - Request validation
dotenv - Environment variable management

## Prerequisites
Before running this project, make sure you have:

Node.js (v14 or higher)
MongoDB (local installation or MongoDB Atlas account)
A valid email account for sending verification codes (Gmail recommended)


## Clone the repository

git clone <your-repo-url>
cd Auth-project

Install dependencies

bashnpm install

## Create a .env file in the root directory with the following variables:

PORT=8000
MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret_key
NODE_CODE_SENDING_EMAIL_ADDRESS=your_email@gmail.com
NODE_CODE_SENDING_EMAIL_PASSWORD=your_email_app_password
HMAC_VERIFICATION_CODE_SECRET=your_hmac_secret_key


## Start the server

npm start
## For development with auto-restart:
npm run dev
The server will start on http://localhost:8000
