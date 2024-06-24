import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import session from "express-session";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(
  session({
    secret: "meow",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // for local env
  })
);
const EMAIL = process.env.EMAIL;
const HOTMAIL = process.env.HOTMAIL;
const YAHOOMAIL = process.env.YAHOOMAIL;
const IOSMAIL = process.env.IOSMAIL;

app.get("/", (req, res) => {
  res.send("ho..ho...ho.... mailer server is up!!");
});

app.get("/email/send", (req, res) => {
  if (!req.session.tokens) {
    return res.status(400).send("User not authenticated");
  }
  const { refresh_token, access_token } = req.session.tokens;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: refresh_token,
      accessToken: access_token,
    },
  });
  const mailOptions = {
    from: EMAIL,
    to: EMAIL,
    cc: [HOTMAIL, YAHOOMAIL, IOSMAIL],
    subject: "Title",
    html: "<div>HTML</div>",
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error sending email");
    } else {
      console.log(info);
      res.send("Email sent");
    }
  });
});

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
