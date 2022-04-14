const path = require("path"),
  express = require("express"),
  app = express(),
  favicon = require("serve-favicon"),
  faviconURL = `${path.join(__dirname, "../public/img/favicon.ico")}`;

app

  .set("port", process.env.PORT || 3000)
  .use(favicon(faviconURL))
  .use(express.static(path.join(__dirname, "../public")));

const server = app.listen(app.get("port"), () => {
  console.log(`Server running on port ${app.get("port")}`);
});

module.exports = server;
