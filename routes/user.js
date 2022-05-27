var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
require("dotenv").config();
var router = express.Router();

//Checks if a user with the email currently exists
async function checkUsers(database, email) {
  const mask = await database("users").where("email", email).first();
  if (!mask) return true;
  else return false;
}

async function comparePass(database, email, password) {
  const storedPass = await database("users")
    .select("password")
    .from("users")
    .where("email", email)
    .first();
  console.log("stored password " + storedPass?.password);
  console.log("password " + password);
  if (bcrypt.compareSync(password, storedPass.password)) {
    return true;
  } else return false;
}

/* POST User details (Register) */
router.post("/register", async (req, res, next) => {
  let { email, password, ...rest } = req.body;

  //Create query for POST
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required",
    });
    return;
  }
  if (await checkUsers(req.db, email)) {
    const query = await req.db("users").insert({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    res.status(201).json({
      message: "User created",
    });

    return;
  } else {
    res.status(409).json({
      message: "User already exists",
    });
  }
});

router.post("/login", async (req, res, next) => {
  let { email, password, ...rest } = req.body;

  //Create query for POST
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required",
    });
    return;
  }

  if (await checkUsers(req.db, email)) {
    res.status(401).json({
      error: true,
      message: "Incorrect email or password",
    });
    return;
  } else {
    if (await comparePass(req.db, email, password)) {
      var token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "86400",
      });

      res.status(200).json({
        token: token,
        token_type: "Bearer",
        expires_in: 86400,
      });
      return;
    } else {
      res.status(401).json({
        error: true,
        message: "Incorrect email or password",
      });
      return;
    }
  }
});

module.exports = router;
