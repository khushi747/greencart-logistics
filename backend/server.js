const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB(); // connect to MongoDB

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/routes", require("./routes/routeRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/simulation", require("./routes/simulationRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to our greencart-logistics");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
