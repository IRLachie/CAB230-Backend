var express = require("express");
var router = express.Router();

/* GET countries listing. */
router.get("/", async (req, res, next) => {
  const query = req.db
    .from("data")
    .select("country")
    .distinct()
    .orderBy("country");
  res.json((await query).map((data) => data.country));
});

module.exports = router;
