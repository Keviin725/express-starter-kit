# Express Authentication Starter Kit

A production-ready Express.js authentication starter kit with MongoDB, JWT, and user management.

## Features

- 🔐 JWT Authentication
- 👤 User Management (Register/Login)
- 📱 Phone Number Authentication
- 🔒 Protected Routes
- 🗄️ MongoDB Integration
- ✨ Express Validation
- 🚀 Production Ready

## Quick Start

1. Clone the repository
```bash
git clone https://github.com/Keviin725/express-starter-kit.git
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a .env file in the root directory (see .env.example)

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Authentication Routes

All authentication routes are prefixed with `/api/auth`

#### Register User
- **POST** `/api/auth/register`
- Body:
  ```json
  {
    "phone": "phone_number",
    "password": "password"
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- Body:
  ```json
  {
    "phone": "phone_number",
    "password": "password"
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- Headers:
  ```
  Authorization: Bearer your_jwt_token
  ```

## Project Structure

```
server/
├── config/
│   └── db.js         # Database configuration
├── controllers/
│   ├── AuthController.js
│   └── UserController.js
├── middlewares/
│   └── AuthMiddleware.js
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── .env.example
├── App.js
├── server.js
└── package.json
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
