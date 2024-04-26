const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// testing is it working
app.get("/", (req, res) => {
  res.send("creative-art-server is running");
});

app.listen(port, () => {
  console.log(`creative-art server running on port:${port}`);
});
