const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const User = require("./user");

dotenv.config();

mongoose.connect(
  //"mongodb+srv://kaikka:6gRZqh8KCfcJHrPx@cluster0.1myzm.mongodb.net/passportDatabase?retryWrites=true&w=majority",
  `${process.env["PART1STRING"]}${process.env["MONGO_USER"]}:${process.env["MONGO_PASSWORD"]}${process.env["MONGO_CLUSTER"]}${process.env["MONGO_DBNAME"]}${process.env["PART2STRING"]}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB is connected");
  }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

// Routes
app.use("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No user exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Success");
        console.log(req.user);
      });
    }
  })(req, res, next);
});

app.use("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User already exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User created");
    }
  });
});

app.get("/getUser", (req, res) => {
  res.send(req.user);
});

app.listen(4000, () => {
  console.log("Server has been started");
});
