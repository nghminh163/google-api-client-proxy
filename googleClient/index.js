const gauth = require("./gAuth");
const gcalendar = require("./gCalendar");

class gAPIs {
  constructor() {}

  generateAuthUrl() {
    return gauth.generateAuthUrl();
  }

  getTokenFromCode() {
    return gauth.getTokenFromCode();
  }

  setCredentials(tokens) {
    gauth.setCredentials(tokens);
    gcalendar.updateAuth2Client(gauth.oAuth2Client);
  }

  get gAuth() {
    return gauth;
  }

  get gCalendar() {
    return gcalendar;
  }
}

module.exports = new gAPIs();
