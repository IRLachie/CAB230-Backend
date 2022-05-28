var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
require("dotenv").config();
var router = express.Router();

/**
 * Checks if a user with the email currently exists
 * @param {any} database
 * @param {string} email
 * @returns {boolean} true/false
 */
async function checkUsers(database, email) {
  const mask = await database("users").where("email", email).first();
  if (!mask) return true;
  else return false;
}

/**
 * Compares the stored hash with the supplied password object
 * @param {any} database
 * @param {string} email
 * @param {string} password
 * @returns {boolean} true/false
 */
async function comparePass(database, email, password) {
  /* SELECT password FROM users WHERE email = req.body.email FIRST */
  const storedPass = await database("users")
    .select("password")
    .from("users")
    .where("email", email)
    .first();
  if (bcrypt.compareSync(password, storedPass.password)) {
    return true;
  } else return false;
}

/* POST User details (Register) */
router.post("/register", async (req, res, next) => {
  let { email, password, ...rest } = req.body;

  //Create query for POST
  if (!email || !password) {
    //Send a status of 400 (Bad Request) and output an error
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required",
    });
    return;
  }
  if (await checkUsers(req.db, email)) {
    /* INSERT query INTO users */
    const query = await req.db("users").insert({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    //Send a status of 201 (Created Success)
    res.status(201).json({
      message: "User created",
    });

    return;
  } else {
    //Send a status of 409 (Conflict) and output an error
    res.status(409).json({
      message: "User already exists",
    });
  }
});

router.post("/login", async (req, res, next) => {
  let { email, password, ...rest } = req.body;

  //Create query for POST
  if (!email || !password) {
    //Send a status of 400 (Bad Request) and output an error
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required",
    });
    return;
  }

  if (await checkUsers(req.db, email)) {
    //Send a status of 401 (Unauthorized) and output an error
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

      //Send a status of 200 (OK) and output a JWT token
      res.status(200).json({
        token: token,
        token_type: "Bearer",
        expires_in: 86400,
      });
      return;
    } else {
      //Send a status of 401 (Unauthorized) and output an error
      res.status(401).json({
        error: true,
        message: "Incorrect email or password",
      });
      return;
    }
  }
});

module.exports = router;
