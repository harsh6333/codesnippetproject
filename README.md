# Code Submission Web Application

This project is a web application built with Express.js and React.js that facilitates the submission and display of code snippets. It consists of two pages: a form for submitting code snippets and a page to display all submitted entries.
(Projected is created for a Task given by https://twitter.com/striver_79)
## Tech Stack

- Express.js (Backend)
- React.js (Frontend)
- MySQL (Database)
- Redis (for caching)
- Judge0 API (Optional, for retrieving code output)

## Features

- Submit code snippets with username, preferred code language, standard input (stdin), and source code.
- Display submitted entries in a tabular format with username, code language, stdin, timestamp, and an optional column for code output (stdout).
- Cache submitted entries using Redis.
- Utilize Judge0 API to retrieve code output (stdout) and display it in a new column .

## Project Structure

The project consists of two main components: the frontend and the backend.

### Frontend

The frontend is built with React.js and Tailwind and includes two main components:

1. **SubmissionForm**: Construct a form to gather the required fields for submitting code snippets.
2. **SubmissionList**: Present all submitted entries in a tabular format.

### Backend

The backend is built with Express.js and handles HTTP requests for submitting and fetching code snippets. It interacts with the MySQL database to store and retrieve submissions.And Redis for caching.

