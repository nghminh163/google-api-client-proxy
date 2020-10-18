const dotenv = require("dotenv-flow");
dotenv.config();

module.exports = {
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  clientCallback: process.env.GOOGLE_CLIENT_CALLBACK || "",
};
