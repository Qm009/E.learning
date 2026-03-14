# E-Learning API Documentation

## Authentication

### Register
- **POST** `/api/auth/register`
- Body: `{ "name": "string", "email": "string", "password": "string", "role": "student|instructor" }`

### Login
- **POST** `/api/auth/login`
- Body: `{ "email": "string", "password": "string" }`

### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`

## Users

### Get All Users (Admin only)
- **GET** `/api/users`
- Headers: `Authorization: Bearer <token>`

### Get User by ID
- **GET** `/api/users/:id`
- Headers: `Authorization: Bearer <token>`

### Update User
- **PUT** `/api/users/:id`
- Headers: `Authorization: Bearer <token>`
- Body: User data

### Delete User (Admin only)
- **DELETE** `/api/users/:id`
- Headers: `Authorization: Bearer <token>`

## Courses

### Get All Courses
- **GET** `/api/courses`

### Get Course by ID
- **GET** `/api/courses/:id`

### Create Course (Instructor/Admin only)
- **POST** `/api/courses`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "title": "string", "description": "string", "category": "string", "price": number, "lessons": [...] }`

### Update Course (Instructor/Admin only)
- **PUT** `/api/courses/:id`
- Headers: `Authorization: Bearer <token>`
- Body: Course data

### Delete Course (Instructor/Admin only)
- **DELETE** `/api/courses/:id`
- Headers: `Authorization: Bearer <token>`

### Enroll in Course
- **POST** `/api/courses/:id/enroll`
- Headers: `Authorization: Bearer <token>`