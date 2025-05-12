import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// router imports
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

dotenv.config();

const PORT = process.env.PORT ?? 3000;
const app = express();

// app.use(cors({

// }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("server is running!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tickets", ticketRoutes);

app.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
