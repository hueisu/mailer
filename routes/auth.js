var express = require("express");
var router = express.Router();

const SCOPES = ["https://mail.google.com/"];

const googleOAuth2Client = require("../config/googleOAuth2Client");

router.get("/login", (req, res) => {
  const authUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    response_type: "code",
    redirect_uri: process.env.REDIRECT_URI,
  });
  res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await googleOAuth2Client.getToken(code);

    googleOAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;
    res.redirect("/email/user");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error authenticating with Google");
  }
});

module.exports = router;
