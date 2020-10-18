const config = require("../config");
const { google } = require("googleapis");

class gAuth {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.clientCallback
    );
    this.scopes = ["https://www.googleapis.com/auth/calendar"];
  }

  get oAuth2Client() {
    return this.oauth2Client;
  }

  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.scopes,
    });
  }

  async getTokenFromCode(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }
}

module.exports = new gAuth();
