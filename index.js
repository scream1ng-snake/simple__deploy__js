const express = require("express");
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const simpleGit = require("simple-git");
const git = simpleGit.default();

const path = require("path")


const PORT = 8000;
const TARGET_REPO = "http://gogs.lex.lan/lykasov_am/test.git"

const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(express.static('client'))



app.post("/commit", (req, res) => {
  console.log(req.body)

  // git.clone(TARGET_REPO, path.join(__dirname, "/client"), {  })
})

const httpServer = http.createServer(app)
httpServer.listen(PORT, () => {
  console.log('SERVER STARTED AT http://localhost:' + PORT)
});