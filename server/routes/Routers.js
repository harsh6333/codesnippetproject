import express from "express";
import mysql from "mysql2";
import Redis from "ioredis";
import axios from "axios";
import "dotenv/config";
const client = new Redis(`${process.env.REDIS_URL}`);
const router = express.Router();

const connection = mysql.createConnection({
  host: `${process.env.SQL_HOST}`,
  port: `${process.env.SQL_PORT}`,
  user: `${process.env.SQL_ADMIN}`,
  password: `${process.env.SQL_PASSWORD}`,
  database: `${process.env.SQL_DATABASE}`,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// const createTableQuery = `
//   CREATE TABLE IF NOT EXISTS submissions (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(255) NOT NULL,
//     language VARCHAR(255) NOT NULL,
//     stdin TEXT,
//     code TEXT,
//     output TEXT,
//     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   )
// `;
// connection.query(createTableQuery, (err, result) => {
//   if (err) {
//     console.error("Error creating submissions table:", err);
//   } else {
//     console.log("Submissions table created or already exists");
//   }
// });

function getCurrentTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Inside the /submit endpoint handler
router.post("/submit", async (req, res) => {
  const { username, language, stdin, code, languageId } = req.body;
  const timestamp = getCurrentTimestamp();
  if (code) {
    try {
      // Send code snippet to Judge0 API for execution
      const submissionResponse = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languageId,
          stdin: stdin,
        },
        {
          headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
            "X-RapidAPI-Key": `${process.env.JUDGE0_API_KEY}`,
            "X-RapidAPI-Host": `${process.env.JUDGE0_HOST}`,
          },
        }
      );
      // Fetch the result of the submission from Judge0 API
      const submissionId = await submissionResponse.data.token;
      const options = {
        method: "GET",
        url: `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`,
        params: {
          base64_encoded: "true",
          fields: "*",
        },
        headers: {
          "X-RapidAPI-Key": `${process.env.JUDGE0_API_KEY}`,
          "X-RapidAPI-Host": `${process.env.JUDGE0_HOST}`,
        },
      };

      const response = await axios.request(options);
      if (!response.data.stdout) {
        console.error("Received null value for stdout");
        res
          .status(500)
          .json({ error: "Received null value for stdout", submissionId });
        return;
      }
      const decodedOutput = Buffer.from(
        response.data.stdout,
        "base64"
      ).toString("utf-8");
      // console.log("Decoded Output:", decodedOutput);

      // Store the submission details in the MySQL database
      const insertQuery =
        "INSERT INTO submissions (username, language, stdin, code, timestamp, output) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(
        insertQuery,
        [username, language, stdin, code, timestamp, decodedOutput],
        (err, result) => {
          if (err) {
            console.error("Error inserting submission into database:", err);
            res.status(500).json({ error: "Error submitting code" });
            return;
          }
          // console.log("Submission added to the database");
          res.status(201).json({ message: "Submission successful" });
        }
      );

      // Invalidate the Redis cache
      client.del("submissions");
    } catch (error) {
      console.error("Error submitting code:", error);
      res.status(500).json({ error: "Error submitting code" });
    }
  }
});

router.get("/submissions", async (req, res) => {
  // Check if data is available in Redis cache
  client.get("submissions", async (error, cachedData) => {
    if (error) {
      console.error("Error retrieving data from Redis cache:", error);
    }

    if (cachedData) {
      console.log("Data retrieved from Redis cache");
      res.status(200).json(JSON.parse(cachedData));
    } else {
      // If data is not cached, fetch it from the database
      const sql =
        "SELECT username, language, stdin, code, timestamp, output FROM submissions";
      connection.query(sql, (err, results) => {
        if (err) {
          console.error("Error fetching submissions:", err);
          res.status(500).json({ error: "Error fetching submissions" });
          return;
        }
        client.setex("submissions", 3600, JSON.stringify(results));

        res.status(200).json(results);
      });
    }
  });
});

export default router;
