# Blog Project

This project is a blog application built with React, using React Hook Form for form handling, and Appwrite for backend services. The application allows users to create, update, and view blog posts, with features like image uploads and real-time content editing.

# Table of Contents

- Features
- Installation
- Usage
- Folder Structure
- Contributing

# Features

- Create and update blog posts.
- Rich Text Editor (RTE) for - creating post content.
- Upload and display featured images.
  -User authentication and authorization.
- Real-time preview of uploaded images.
- Responsive design.

# Installation

- git clone https://github.com/yourusername/blog-project.git

       cd blog-project
       npm install
       npm start

# Set up Appwrite :

- Ensure you have an Appwrite server running.
- Create a new project in Appwrite.
- Create necessary collections and attributes for posts.
- Configure your Appwrite endpoint and project ID in your environment variables.

# Set environment variables:

- Create a .env file in the root directory and add the following:

      VITE_APPWRITE_URL=""
      VITE_APPWRITE_PROJECT_ID=""
      VITE_APPWRITE_DATABASE_ID=""
      VITE_APPWRITE_COLLECTION_ID=""
      VITE_APPWRITE_BUCKET_ID=""

# Usage

- Run the development server:
        npm run build
- Build for production:
        npm start
- Run tests:
        npm test

# Folder Structure

               blog-project/
                ├── public/
                │   ├── index.html
                │   └── ...
                ├── src/
                │   ├── appwrite/
                │   │   ├── config.js
                │   │   ├── post.js
                │   │   └── ...
                │   ├── components/
                │   │   ├── Button.jsx
                │   │   ├── Input.jsx
                │   │   ├── RTE.jsx
                │   │   ├── Select.jsx
                │   │   └── ...
                │   │   
                │   ├── pages/
                │   │   ├── Home.jsx
                │   │   ├── Login.jsx
                │   │   ├── Signup.jsx
                │   │   ├── Post.jsx
                │   │   ├── AllPost.jsx
                │   │   ├── EditPost.jsx
                │   │   └── ...
                │   ├── Store
                │   │   ├── store.js
                │   │   ├── authSlice.js
                │   │   └── ...
                │   ├── App.js
                │   ├── index.js
                │   └── ...
                ├── .env
                ├── package.json
                ├── README.md
                └── ...

