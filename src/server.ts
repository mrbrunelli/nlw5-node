import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log("Server is Running on port " + PORT));