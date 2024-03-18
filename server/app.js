import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Routers from './routes/Routers.js'
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api",Routers);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
