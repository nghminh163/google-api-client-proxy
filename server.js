const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const gAPI = require("./googleClient");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const _ = require("lodash");
const moment = require("moment");
const adapter = new FileSync("db.json", {
  defaultValue: { user: {} },
});
const db = low(adapter);
app.use(bodyParser.json());
app.set("PORT", process.env.PORT || 3000);
app.set("views", "./views");
app.set("view engine", "pug");

const data = db.get("user").value();
if (!_.isEmpty(data)) {
  gAPI.setCredentials({ refresh_token: data.refresh_token });
}

app.listen(app.get("PORT"), () => {
  console.log(`Server is running at http://localhost:${app.get("PORT")}`);
});

app.get("/ping", (req, res) => res.send("pong"));

app.get("/authUrl", (req, res) => res.json({ url: gAuth.generateAuthUrl() }));

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const token = await gAPI.getTokenFromCode(code);
    db.set("user", token).write();
    res.send("ok");
  } catch (e) {
    res.status(401);
    res.send("Wrong code");
  }
});

app.get("/calendars", async (req, res) => {
  const listCalendar = await gAPI.gCalendar.getCalendars(req.query["simple"]);
  res.json(listCalendar);
});

app.get("/event/:idCalendar/:idEvent", async (req, res) => {
  const event = await gAPI.gCalendar.getEvent(
    req.params["idCalendar"],
    req.params["idEvent"]
  );
  res.json(event);
});

app.get("/events/:idCalendar", async (req, res) => {
  const listEvents = await gAPI.gCalendar.getEvents(
    req.params["idCalendar"],
    req.query["timeMin"],
    req.query["timeMax"]
  );
  res.json(listEvents);
});

app.post("/subcribeCalendar/:idCalendar", async (req, res) => {
  const data = await gAPI.gCalendar.subscribeEvent(
    req.params["idCalendar"],
    req.body["endpoint"]
  );
  res.json(data);
});

app.post("/unsubcribeCalendar", async (req, res) => {
  const data = await gAPI.gCalendar.unsubcribeEvent(req.body);
  res.json(data);
});

// View
app.get("/login", (req, res) => {
  res.render("login", { title: "Login", url: gAPI.generateAuthUrl() });
});

app.get("/info", (req, res) => {
  const data = db.get("user").value();
  if (_.isEmpty(data)) {
    res.send("Not login");
    return;
  }
  res.render("info", {
    title: "Info",
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    scope: data.scope,
    expiry_date: moment(data.expiry_date).format("HH:mm:ss DD/MM/YYYY"),
  });
});
