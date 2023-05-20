import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
//INIT APP
import { init } from "./helpers/DBconnection.js";
//ROUTES IMPORT
import { categoryRoute } from "./routes/categoryRoute.js";
import { freelancerRoute } from "./routes/freelancerRoute.js";

//Configuration
config();
const app = express();

//APP MiddleWares
app.use(cors());
app.use(express.json());

//Serveing file staticly ==>> localhost:port/Freelancers-avatars/...
const filename = fileURLToPath(import.meta.url);
app.use(
  "/Freelancers-Avatars",
  express.static(path.join(path.dirname(filename), "Freelancers-Avatars"))
);

//MiddleWares Routes
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/freelancers", freelancerRoute);

//Catch All Routes
app.get("*", (request, response) => {
  response.status(200).json({ error: "This Route Is Not Correct" });
});

//ERROR HANDLING
app.use((error, request, response, next) => {
  response.status(error.statusCode).json({ error: error.message });
});

init(app);
