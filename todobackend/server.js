const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require('cors');

connectDb();

const corsOptions = {
    origin: 'http://localhost:3000', // Add the specific origin of your frontend
    credentials: true,
};

const app = express();
const port = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});