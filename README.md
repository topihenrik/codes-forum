# Codes Forum Project
Fullstack application made for the "Advanced Web Applications" course as a final project. The frontend and backend are both included in this monorepo. Apollo GraphQL, TypeScript, React.js, MongoDB and CI/CD are some of the concepts that were utilized in this project. The features of the application can be tested by the reviewer in the live version.

## Live preview

https://sparkling-glade-4102.fly.dev/

![codes-forum](https://user-images.githubusercontent.com/79649210/222962115-e74bdfea-dd82-417c-bf54-dc8360503e9f.png)

## What was utilized?
### General
* TypeScript - Strongly typed programming language
* GraphQL - A query language for the API
* Code Generator - Generates TypeScript types from GraphQL schemas
* Cypress - End-to-end testing
* ESLint - Source code static analysis

### Frontend
* Vite - Frontend tooling
* React.js - Library for building user interfaces
* Apollo Client - State management library for GraphQL
* MUI - React UI component library
* React Draft.js - WYSIWYG editor

### Backend
* Node.js - JavaScript runtime
* Apollo Server - GraphQL server
* Cloudinary - Image file management
* MongoDB - NoSQL document-oriented database

## Features
### Visitors are able to
* View list of posts ( 10 posts in one page )
  * Title
  * Author
  * Creation date
  * Number of likes
  * Number of comments
  * Tags
* View specific post and its comments
  * Post title
  * Post author
  * Post creation date and modified date
  * Post content
  * Post likes
  * Post tags
  * Comment author
  * Comment creation date and modified date
  * Comment content
  * Comment likes
* View a user profile
  * Username
  * Bio
  * Total number of submitted posts and comments
  * Account age in days
  * 3 most recent posts and comments
* Create a new account
  * Username
  * Password
  * Avatar
* Log in to an existing account

### Users are able to
* Create a post
  * Title
  * Main content
  * Tags
* Edit their post
  * Title
  * Main content
  * Tags
* Like a post
* Delete their post
* Create a comment
* Edit their comment
* Like a comment
* Delete their comment
* Edit their personal information
  * Username
  * Bio
  * Avatar
  * Password
* Delete their account (including all their posts and comments)
    

## How many points should I obtain?
| Feature | Max points |
| --- | --- |
| Basic features | 25 |
| Users can edit their own comments/posts | 4 |
| Utilization of a frontside framework: React | 5 |
| User can click username and see user profile page where name, register date, user picture and user bio is listed | 2 |
| Last edited timestamp is stored and shown with posts/comments | 2 |
| 10 end-to-end tests created with cypress | 5 |
| Like posts and comments (only one like per user) | 3 |
| Use of a pager when there is more than 10 posts available | 2 |
| User profiles can have images which are show next to posts/comments | 3 |
| Use of CI/CD practices with Git, GitHub, GitHub Actions and Docker. <li>Git Feature Branch Workflow</li><li>Cypress and ESLint tests must succeed before a merge to main</li><li>Deployment to Fly.io PaaS can be done after a successful merge</li> | 5 |
| <b>Total points</b> | <b>50+</b> |
