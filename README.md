# WTWR (What to Wear?): Back-End

The back-end project for the **WTWR (What to Wear?)** application serves as the server-side logic and data management for user profiles and clothing item interactions. This API enables core operations like creating, reading, updating, and deleting users and items, as well as handling user interactions with items such as liking or unliking them.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
  - [User Routes](#user-routes)
  - [Item Routes](#item-routes)
  - [Data Models](#data-models)
- [Technologies Used](#technologies-used)
- [Setup and Running the Project](#setup-and-running-the-project)
- [Development](#development)
- [Testing](#testing)

## Overview

This back-end API is designed to:
- Manage user profiles with features like creating and fetching user data.
- Handle clothing item data, including adding, retrieving, deleting, and liking/unliking items.
- Provide error handling with appropriate HTTP status codes to ensure a smooth user experience.

## Features

### User Routes

- **Get All Users**: Retrieves a list of all users in the database.
- **Get User by ID**: Fetches user data based on a provided `userId`.
- **Create User**: Creates a new user with fields `name` and `avatar` (which must be a valid URL).

### Item Routes

- **Get All Items**: Retrieves all clothing items, each populated with the owner’s information.
- **Get Item by ID**: Fetches an item by its `itemId`, with error handling for missing or invalid IDs.
- **Create Item**: Adds a new clothing item with details such as `name`, `weather` (categorized as "hot," "warm," or "cold"), and `imageUrl` (must be a valid URL).
- **Delete Item**: Removes a clothing item based on its `itemId`.
- **Like/Unlike Item**: Allows users to like or unlike items, updating the list of users who have liked the item.

### Data Models

- **User Model**: Defines a schema with `name` and `avatar` fields, where `avatar` requires a valid URL format.
- **Clothing Item Model**: Contains properties for `name`, `weather`, `imageUrl`, `owner`, `likes`, and `createdAt`. Validation rules ensure appropriate field lengths, valid URLs, and user tracking in the `likes` array.

## Technologies Used
- **Node.js** and **Express.js**: Server setup and routing.
- **MongoDB** and **Mongoose**: Database and data modeling.
- **Validator**: For validating fields such as URLs.
- **dotenv**: Environment variable management.

## Setup and Running the Project

To run this project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/NikitaStambul/se_project_express.git
   cd se_project_express
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   - Create a `.env` file in the project root and add your environment variables such as `PORT` and `DATABASE_URL`.

4. **Start the Server**:
   - For production:
     ```bash
     npm run start
     ```
   - For development with hot-reloading:
     ```bash
     npm run dev
     ```

## Development

This project uses [Nodemon](https://nodemon.io/) for auto-reloading during development, allowing the server to restart automatically whenever file changes are detected.

## Testing

For sprint-based development, ensure that the current sprint number is documented:

1. Open the `sprint.txt` file located in the root folder.
2. Edit the file to reflect the number of the sprint you're working on, e.g., `12`.
