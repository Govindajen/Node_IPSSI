require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));

const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTION_STRING, {
  
}).then(() => console.log("Connected to MongoDB"));




const routes = require("./routes");
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});