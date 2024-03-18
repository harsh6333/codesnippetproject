# Code Submission Server

This project is an Express server that handles HTTP requests for submitting code snippets and fetching submissions. It uses MySQL for database storage and Redis for caching.(Projected is created for a Task given by https://twitter.com/striver_79)

## Requirements

- Node.js
- npm (Node Package Manager)
- MySQL
- Redis

## Installation

1. Clone the repository:

2. Navigate to the project directory:

3. Install dependencies:

4. Create a `.env` file in the project root directory and add the following environment variables:

REDIS_URL=your-redis-url
SQL_HOST=your-sql-host
SQL_PORT=your-sql-port
SQL_ADMIN=your-sql-admin-username
SQL_PASSWORD=your-sql-password
SQL_DATABASE=your-sql-database
JUDGE0_API_KEY=your-judge0-api-key
JUDGE0_HOST=your-judge0-host

Replace `your-redis-url`, `your-sql-host`, `your-sql-port`, `your-sql-admin-username`, `your-sql-password`, `your-sql-database`, `your-judge0-api-key`, and `your-judge0-host` with your actual configuration values.

## Usage

1. Start the server: npm start

2. Use the following endpoints for submitting code and fetching submissions:

- Submit code: `POST /api/submit`
- Fetch submissions: `GET /api/submissions`
