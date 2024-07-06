# MERN CRUD Blog App

## Table of Contents

1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Features](#features)
4. [Technologies Used](#technologies-used)
5. [Installation and Setup](#installation-and-setup)
6. [API Endpoints](#api-endpoints)
7. [Usage](#usage)
8. [Contributing](#contributing)
9. [License](#license)
10. [Acknowledgements](#acknowledgements)

## Introduction

Welcome to my MERN stack blog app! This project is a full-stack application built using MongoDB, Express.js, React.js, and Node.js. It provides a platform for users to create, read, update, and delete blog posts. The app also includes features for user authentication, authorization, and profile management.

## Project Structure

```
root
│   README.md
│   package.json
│   .env
│
├───client
│   │   package.json
│   │   public
│   │   src
│   │   ├───components
│   │   ├───context
│   │   ├───pages
│   │   ├───styles
│   │   └───utils
│
└───server
    │   package.json
    │   server.js
    ├───config
    ├───controllers
    ├───middleware
    ├───models
    ├───routes
    └───utils
```

## Features

- User Authentication and Authorization
- Create, Read, Update, and Delete (CRUD) operations for blog posts
- User profile management
- Avatar upload functionality
- Responsive UI

## Technologies Used

- **MongoDB**: Database for storing blog posts and user data
- **Express.js**: Web framework for Node.js
- **React.js**: Frontend library for building user interfaces
- **Node.js**: JavaScript runtime environment
- **Mongoose**: ODM for MongoDB
- **JWT**: For user authentication
- **Axios**: For making HTTP requests
- **bcrypt**: For hashing passwords
- **multer**: For handling file uploads

## Installation and Setup

### Prerequisites

- Node.js and npm installed on your local machine
- MongoDB server running locally or a MongoDB Atlas account

## API Endpoints

### Authentication

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login a user

### User

- `GET /api/users/:id`: Get user details
- `PATCH /api/users/edit-user`: Edit user details
- `POST /api/users/change-avatar`: Change user avatar

### Blog Posts

- `GET /api/posts`: Get all posts
- `GET /api/posts/:id`: Get a single post
- `POST /api/posts`: Create a new post
- `PATCH /api/posts/:id`: Update a post
- `DELETE /api/posts/:id`: Delete a post

## Usage

After completing the installation and setup steps, you can start using the application. Register a new user, login, and start creating blog posts. You can edit your profile and upload a new avatar from the user profile page.

## Acknowledgements

Thank you for taking the time to check out my project. Your support and encouragement are greatly appreciated!

---

Feel free to reach out if you have any questions or suggestions. Happy coding! 😊✨
