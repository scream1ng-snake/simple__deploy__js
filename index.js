const express = require("express");
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const simpleGit = require("simple-git");
const git = simpleGit.default();
const {
  runNpmInstall,
  emptyDir,
  ensureDir, 
  runNpmBuild,
  moveStaticToDeploy
} = require('./commands')
const fs = require("fs")
const path = require("path")


const PORT = 8000;
const TARGET_REPO = "https://github.com/scream1ng-snake/eli_peli_tg_app.git"
const TARGET_REPO_BRANCH = "lykasov_am"
const CLIENT_PATH = path.join(__dirname, "/client")
const LOCAL_REPO_PATH = path.join(__dirname, "/repo")

const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(express.static('client'))


app.post("/manual_update", (req, res) => {
  console.log("manual update initialized")
  runBuild()
    .then(() => res.status(200).send("DEPLOYED SUCCESSFULLY"))
})
app.post("/commit", (req, res) => {
  try {
    console.log("NEW COMMIT")
    const validated = req.body
      && typeof req.body === "object"
      && !Array.isArray(req.body)
      && Object.entries(req.body).length
      && Object.prototype.hasOwnProperty("ref")

    if(validated) {
      /** ref: 'refs/heads/master', */
      const branch = req.body.ref.split("/")[2]

      if(branch === TARGET_REPO_BRANCH) runBuild()
      .then(() => console.log("DEPLOYED SUCCESSFULLY"))
    } else {
      throw new Error("COMMIT OBJECT IS NOT VALIDATED")
    }
    
  } catch (err) {
    console.error(err)
  }
})

function runBuild() {
  return new Promise(async (resolve, reject) => {
    ensureDir(LOCAL_REPO_PATH)
    ensureDir(CLIENT_PATH)
    await emptyDir(LOCAL_REPO_PATH)
    
    git.clone(TARGET_REPO, LOCAL_REPO_PATH, undefined, (err, data) => {
      if (err) {
        console.error("[runBuild] ПРИ ВЫПОЛНЕНИИ 'GIT CLONE' ПРОИЗОШЛА ОШИБКА")
        console.error(err)
        reject(err)
      } else {
        console.log("[runBuild] РЕПОЗИТОРИЙ СКАЧАН")
        console.log("[runBuild] data: " + data)

        runNpmInstall(LOCAL_REPO_PATH) 
          .then(() => runNpmBuild(LOCAL_REPO_PATH))
          .then(async () => await emptyDir(CLIENT_PATH))
          .then(() => moveStaticToDeploy(LOCAL_REPO_PATH + "/build", CLIENT_PATH))
          .then(() => resolve())
          .catch(console.error)
      }
    }

    )
  })
}

const httpServer = http.createServer(app)
httpServer.listen(PORT, () => {
  console.log('SERVER STARTED AT http://localhost:' + PORT)
});