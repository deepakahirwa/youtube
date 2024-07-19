
# Video Streaming plateform Backend Project

This project is a backend implementation of a YouTube-like platform, providing various features such as video uploads, comments, playlists, subscriptions, user authentication, and more.

## Features

- **User Registration**: New users can register with their email and password.
- **User Login**: Registered users can log in to access their accounts.
- **Video Management**: Users can upload, edit, delete, and search for videos.
- **Comment Management**: Users can add, edit, delete, and search for comments on videos and posts.
- **Like Comments and Videos**: Users can like comments and videos.
- **Playlist Management**: Users can create, edit, delete, and search for playlists.
- **Post Management**: Users can create, edit, delete, and search for posts.
- **Subscription Management**: Users can subscribe to channels, manage subscriptions, and view subscriptions.
- **Dashboard**: Users can view their activity and statistics.
- **Health Check**: Endpoint to check the health of the server.
- **User Management**: Users can manage their account details.



## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/) (for database)
- [Cloudinary](https://cloudinary.com/) (for video storage and management)

### Steps

1.  Clone the repository:
    ```bash
    git clone https://github.com/deepakahirwa/youtube.git
    cd youtube-backend
    ```
2.  Install dependencies

          npm install

3.  Create a .env file in the root directory and add the following environment variables:

         PORT=""
         CORS_ORIGIN=""
         MONGODB_URI=""
         ACCESS_TOKEN_SECRET=""
         ACCESS_TOKEN_EXPIRY=""

         REFRESH_TOKEN_SECRET=""
         REFRESH_TOKEN_EXPIRY=""

         CLOUDINARY_CLOUD_NAME=""
         CLOUDINARY_API_KEY=""
         CLOUDINARY_API_SECRET=""

4.  Start the server:

            youtube-backend/
            ├── controllers/
            │   ├── auth.controller.js
            │   ├── comment.controller.js
            │   ├── dashboard.controller.js
            │   ├── healthcheck.controller.js
            │   ├── like.controller.js
            │   ├── playlist.controller.js
            │   ├── post.controller.js
            │   ├── subscription.controller.js
            │   ├── user.controller.js
            │   ├── video.controller.js
            ├── middlewares/
            │   ├── multer.middleware.js
            │   ├── auth.middleware.js
            ├── models/
            │   ├── user.model.js
            │   ├── video.model.js
            │   ├── comment.model.js
            │   ├── playlist.model.js
            │   ├── post.model.js
            │   ├── subscription.model.js
            │   ├── like.model.js
            │   ├── dashboard.model.js
            │   ├── healthcheck.model.js
            ├── routes/
            │   ├── auth.routes.js
            │   ├── comment.routes.js
            │   ├── dashboard.routes.js
            │   ├── healthcheck.routes.js
            │   ├── like.routes.js
            │   ├── playlist.routes.js
            │   ├── post.routes.js
            │   ├── subscription.routes.js
            │   ├── user.routes.js
            │   ├── video.routes.js
            ├── utils/
            │   ├── ApiError.js
            │   ├── ApiResponse.js
            │   ├── asyncHandler.js
            │   ├── cloudinary.js
            │   ├── deleteOnCloudinary.js
            ├── .env
            ├── app.js
            ├── package.json
            └── README.md

### Middleware

- multer.middleware.js

      Handles file uploads using multer.

- auth.middleware.js
      Handles JWT authentication.

### Controllers

- auth.controller.js

      Handles user registration and login.

- comment.controller.js

       Handles comments on videos and posts, including creating, editing, deleting, and searching for comments.

- dashboard.controller.js

       Handles user activity and statistics.

- healthcheck.controller.js

       Provides an endpoint to check the health of the server.

- like.controller.js

       Handles likes on videos and comments.

- playlist.controller.js

       Handles playlist creation, retrieval, editing, and deletion.

- post.controller.js

       Handles post creation, editing, deletion, and searching.

- subscription.controller.js

       Handles channel subscriptions.

- user.controller.js

       Handles user information, updates, and management.

- video.controller.js

       Handles video uploads, retrieval, editing, deletion, and searching.

### Routes

- auth.routes.js

       Routes for user registration and login.

- comment.routes.js

       Routes for commenting on videos and posts.

- dashboard.routes.js

       Routes for viewing user activity and statistics.

- healthcheck.routes.js

       Routes for checking the health of the server.

- like.routes.js

       Routes for liking videos and comments.

- playlist.routes.js

       Routes for playlist creation and retrieval.

- post.routes.js

       Routes for managing posts.

- subscription.routes.js

       Routes for subscribing to channels and getting subscriptions.

- user.routes.js

       Routes for user information and updates.

- video.routes.js
  Routes for video upload and retrieval.

### Utilities

- ApiError.js

       Custom error handling for API responses.

- ApiResponse.js

       Standardized format for API responses.

- asyncHandler.js

       Helper function to handle asynchronous operations.

- cloudinary.js

       Utility for interacting with Cloudinary.

- deleteOnCloudinary.js

       Utility for deleting files on Cloudinary.

## Running the Project

Clone the project

```bash
  git clone https://github.com/deepakahirwa/youtube.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Running the Project

`Clone the project`

```bash
  git clone https://github.com/deepakahirwa/youtube.git
```

`Go to the project directory`

```bash
  cd my-project
```

`Install dependencies`

```bash
  npm install
```

`Start the server`

```bash
  npm start
```

### **Testing**

- `Use a tool like Postman to test the endpoints.`
