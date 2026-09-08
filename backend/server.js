const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/farms", require("./routes/farmRoutes"));
app.use("/api/crops", require("./routes/cropRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/revenues", require("./routes/revenueRoutes"));
app.use("/api/predictions", require("./routes/predictionRoutes"));

app.get("/", (req, res) => res.json({ status: "KrishiVerse API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));