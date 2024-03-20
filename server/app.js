import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Routers from "./routes/Routers.js";
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to set headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use("/api", Routers);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
