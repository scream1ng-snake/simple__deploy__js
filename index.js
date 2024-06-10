const express = require("express");

const app = express()
app.post("/test", (req, res) => {
  res.send("asassassas")
})
app.listen(3000)