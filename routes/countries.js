var express = require("express");
var router = express.Router();

/* GET countries listing. */
router.get("/", async (req, res, next) => {
  /* SELECT DISTINCT country FROM data ORDER BY country */
  const query = req.db
    .from("data")
    .select("country")
    .distinct()
    .orderBy("country");
  res.status(200).json((await query).map((data) => data.country));
});

module.exports = router;
