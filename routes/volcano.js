var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null || token === undefined) return false;

  if (
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
      if (!err) {
        return true;
      } else return err;
    })
  ) {
    return true;
  } else return false;
}

/* GET countries listing. */
router.get("/:id", async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const type = authHeader && authHeader.split(" ")[0];
  let id = req.params["id"];

  if (authHeader && type !== "Bearer") {
    res.status(401).json({
      error: true,
      message: "Authorization header is malformed",
    });
    return;
  }

  if (
    authHeader &&
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
      if (err) return true;
      else return false;
    })
  ) {
    res.status(401).json({
      error: true,
      message: "Invalid JWT token",
    });
    return;
  }

  if (id > 1000) {
    res.status(404).json({
      error: true,
      message: "Not found",
    });
    return;
  }

  if (!isNaN(id)) {
    if (authenticateToken(req)) {
      res.status(200).json(await req.db("data").where("id", id).first());
    } else {
      const query = await req
        .db("data")
        .select(
          "id",
          "name",
          "country",
          "region",
          "subregion",
          "last_eruption",
          "summit",
          "elevation",
          "latitude",
          "longitude"
        )
        .where("id", id)
        .first();

      res.status(200).json(await query);
    }
  } else {
    res.status(400).json({
      error: true,
      message: "Bad Request",
    });
    return;
  }
});

module.exports = router;
