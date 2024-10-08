import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { translate } from "@vitalets/google-translate-api";
import axios from "axios";
//INIT APP
import { init } from "./helpers/DBconnection.js";
//ROUTES IMPORT
import { categoryRoute } from "./routes/categoryRoute.js";
import { freelancerRoute } from "./routes/freelancerRoute.js";
import { projectRoute } from "./routes/projectRoute.js";
import clientRouter from "./routes/clientRoute.js";
import { offerRoute } from "./routes/offerRoute.js";
import { chatRoute } from "./routes/chatRoute.js";
import { skillesRoute } from "./routes/skillRoute.js";
import { adminRoute } from "./routes/adminRoute.js";
import { transactionRoute } from "./routes/transactionRoute.js";
import { notificationRoute } from "./routes/notificationRoute.js";
//Configuration
config();
const app = express();

//APP MiddleWares
app.use(cors());
app.use(express.json());

//Serveing file staticly ==>> localhost:port/Freelancers-avatars/...
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(
  "/Freelancers-Avatars",
  express.static(path.join(path.dirname(filename), "Freelancers-Avatars"))
);
app.use(
  "/uploads",
  express.static(path.join(path.dirname(filename), "uploads"))
);
app.use("/projectfiles", express.static(path.join(__dirname, "projectfiles")));

//MiddleWares Routes
app.use("/api/v1", offerRoute);
app.use("/api", chatRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/freelancers", freelancerRoute);
app.use("/api/v1/projects", projectRoute);
app.use("/api/v1/skills", skillesRoute);
app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/payment", transactionRoute);
app.use("/api/v1/notifications", notificationRoute);
app.get("/api/v1/translate", async (req, res) => {
  const url = `https://api.pawan.krd/gtranslate?from=en&to=ar&text=${req.query.text}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//Catch All Routes
app.use("*", (request, response) => {
  response.status(404).json({ error: "This Route Is Not Correct" });
});

//ERROR HANDLING
app.use((error, request, response, next) => {
  const status = error.status || 500;
  response.status(status).json({ error: error.message });
});

init(app);
