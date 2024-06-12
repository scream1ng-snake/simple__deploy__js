const { exec } = require('child_process');
const fs = require("fs")
const path = require("path")

module.exports = {
  ensureDir(path) {
    if(!fs.existsSync(path)) fs.mkdirSync(path) 
  },
  moveStaticToDeploy: (BUILD_PATH, CLIENT_PATH) => {
    if(fs.existsSync(BUILD_PATH)) {
      if(fs.existsSync(CLIENT_PATH)) {
        fs.cpSync(BUILD_PATH, CLIENT_PATH, { recursive: true })
        console.log("files copied to " + CLIENT_PATH + " from " + BUILD_PATH)
      } else {
        console.error("client path is not exists")
        throw new Error("client path is not exists")
      }
    } else {
      console.error("build path is not exists")
      throw new Error("build path is not exists")
    }
  }, 
  gitClone(TARGET_REPO, LOCAL_REPO_PATH) {
    return new Promise((resolve, reject) => {
      const childprocess = exec('git clone ' + TARGET_REPO, { cwd: LOCAL_REPO_PATH }, function (error, stdout, stderr) {
        if (error) console.log('exec error: ' + error)
        if (stderr) console.log('stderr: ' + stderr);
        console.log('stdout: ' + stdout);
      })
      childprocess.on("error", reject)
      childprocess.on("close", resolve)
    })
  },
  async emptyDir(LOCAL_REPO_PATH) {
    fs.rmSync(LOCAL_REPO_PATH, { force: true, recursive: true })
    fs.mkdirSync(LOCAL_REPO_PATH)
  },
  runNpmInstall(LOCAL_REPO_PATH) {
    return new Promise((resolve, reject) => {
      if (fs.readdirSync(LOCAL_REPO_PATH).includes("package.json")) {
        const childprocess = exec('npm install', { cwd: LOCAL_REPO_PATH }, function (error, stdout, stderr) {
          if (error) console.log('exec error: ' + error)
          if (stderr) console.log('stderr: ' + stderr);
          console.log('stdout: ' + stdout);
        })
        childprocess.on("error", reject)
        childprocess.on("close", resolve)
      } else {
        throw new Error("package.json not found")
      }
    })
  },
  runNpmBuild(LOCAL_REPO_PATH) {
    return new Promise((resolve, reject) => {
      if (fs.readdirSync(LOCAL_REPO_PATH).includes("package.json")) {
        const childprocess = exec('npm run build', { cwd: LOCAL_REPO_PATH }, function (error, stdout, stderr) {
          if (error) console.log('exec error: ' + error)
          if (stderr) console.log('stderr: ' + stderr);
          console.log('stdout: ' + stdout);
        })
        childprocess.on("error", reject)
        childprocess.on("close", resolve)
      } else {
        throw new Error("package.json not found")
      }
    })
  }
}