require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/AuthRoute");
const authInvoice = require("./routes/InvoiceRoute");
const authGenAI = require("./routes/GenAIRoute");
const connectDB = require("./config/db");

const app = express();



// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Routes Here
app.use("/api/auth",authRoutes);
app.use("/api/invoice", authInvoice);
app.use("/api/genai", authGenAI);

// Serve frontend build
app.use(
  express.static(path.join(__dirname, "..", "frontend", "dist"))
);

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "frontend", "dist", "index.html")
  );
});




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
