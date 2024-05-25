const { exec } = require("child_process");
const path = require("path");

const homeview = (req, res, next) => {
  res.render("home", { title: "Home" });
};

const resultatnmap = (req, res, next) => {
  const url = req.body.url;

  exec(`./helpers/script.sh ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send("Server Error");
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      res.status(500).send("Server Error");
      return;
    }
    console.log(`Script output: ${stdout}`);
    res.render("result", { title: "Scan Result" });
  });
};

module.exports = {
  homeview,
  resultatnmap,
};
